import { Logger, UseFilters, UseGuards, OnModuleInit } from '@nestjs/common';
import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  WsException, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  OnGatewayInit,
  WsResponse
} from '@nestjs/websockets';
import { Server as SocketIOServer, Socket, Server as IoServer } from 'socket.io';
import { 
  type ClientToServerEvents, 
  type ServerToClientEvents, 
  type InterServerEvents, 
  type SocketData, 
  type AuthenticatedSocket,
  type Server as RtcServer,
  type Socket as RtcSocket,
  type BaseSocket
} from './types/socket-events.types';
import { JwtWsAuthGuard } from '../../auth/guards/jwt-ws-auth.guard';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { WsThrottlerGuard } from '../../common/guards/ws-throttler.guard';
import {
  ClientEvents,
  ServerEvents,
  UserInfo,
  TrackUpdate,
  PresenceUpdate,
  SignalingMessage,
  RoomInfo,
} from './types/websocket.types';



@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: true,
})
@UseGuards(JwtWsAuthGuard, WsThrottlerGuard)
@UseFilters(WsExceptionFilter)
export class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  private io: any; // Using any to avoid complex type conflicts
  
  // Alias for backward compatibility
  get server(): any {
    return this.io;
  }

  /**
   * Registers a WebSocket server instance
   * @param server - The WebSocket server instance
   */
  registerWsServer(server: any) {
    this.io = server;
  }

  // Helper to safely access server
  private getServer() {
    if (!this.server) {
      throw new Error('WebSocket server not initialized');
    }
    return this.server;
  }
  
  // Helper to safely get socket by ID
  private getSocket(socketId: string): Socket | undefined {
    if (!this.server?.sockets) return undefined;
    // Access the sockets map from the namespace
    return this.server.sockets.sockets.get(socketId);
  }

  private readonly logger = new Logger(RtcGateway.name);
  private readonly userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private readonly socketToUser = new Map<string, string>(); // socketId -> userId
  private readonly userRooms = new Map<string, Set<string>>(); // userId -> Set<roomId>
  private readonly roomUsers = new Map<string, Set<string>>(); // roomId -> Set<userId>
  private readonly userPresence = new Map<string, boolean>(); // userId -> isOnline
  private readonly lastSeen = new Map<string, Date>(); // userId -> lastSeen
  private readonly missedPings = new Map<string, number>(); // socketId -> missedPings
  private readonly MAX_MISSED_PINGS = 3;
  private pingInterval: NodeJS.Timeout;

  // Track active connections for health checks
  get activeConnections(): number {
    return this.socketToUser.size;
  }

  // Track active rooms for health checks
  get activeRooms(): number {
    return this.roomUsers.size;
  }

  // Track active users for health checks
  get activeUsers(): number {
    return this.userSockets.size;
  }

  onModuleInit() {
    this.setupPingInterval();
  }

  private setupPingInterval() {
    // Clear existing interval if any
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Setup new interval
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      const disconnectedSockets: string[] = [];

      // Check all sockets for missed pings
      this.missedPings.forEach((count, socketId) => {
        if (count >= this.MAX_MISSED_PINGS) {
          disconnectedSockets.push(socketId);
        } else {
          this.missedPings.set(socketId, count + 1);
        }
      });

      // Clean up disconnected sockets
      disconnectedSockets.forEach(socketId => {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect(true);
        }
      });
    }, 10000); // Check every 10 seconds
  }

  async handleConnection(client: AuthenticatedSocket) {
    // Type guard to ensure user is defined
    if (!client.handshake?.user) {
      this.logger.warn('Connection attempt without valid user');
      client.disconnect(true);
      return;
    }
    
    // Add user info to socket data for type safety
    const user = client.handshake.user;
    client.data = {
      userId: user.userId,
      user
    };
    try {
      const user = client.handshake.user;
      if (!user || !user.userId) {
        throw new WsException('Unauthorized: Missing or invalid user information');
      }

      const { userId } = user;
      const socketId = client.id;

      // Initialize user data structures if they don't exist
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
        this.userRooms.set(userId, new Set());
      }

      // Track the socket
      this.userSockets.get(userId)?.add(socketId);
      this.socketToUser.set(socketId, userId);
      this.missedPings.set(socketId, 0);
      this.userPresence.set(userId, true);
      this.lastSeen.set(userId, new Date());

      // Set up ping handler
      client.on('ping', () => {
        this.missedPings.set(socketId, 0);
        client.emit('pong', { timestamp: Date.now() });
      });

      // Notify the client of successful connection
      client.emit(ServerEvents.CONNECT, {
        userId,
        socketId,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Client connected: ${socketId} (User: ${userId})`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.emit(ServerEvents.ERROR, {
        code: 'CONNECTION_ERROR',
        message: error.message || 'Connection error',
      });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const socketId = client.id;
    const userId = this.socketToUser.get(socketId);

    if (!userId) {
      this.logger.warn(`Disconnected untracked socket: ${socketId}`);
      return;
    }

    // Clean up socket references
    this.socketToUser.delete(socketId);
    this.missedPings.delete(socketId);

    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(socketId);

      // If this was the last socket for the user, mark as offline
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
        this.userPresence.set(userId, false);
        this.lastSeen.set(userId, new Date());

        // Notify rooms that the user left
        const userRooms = this.userRooms.get(userId) || new Set();
        userRooms.forEach(roomId => {
          this.leaveRoom(userId, roomId);
        });
        this.userRooms.delete(userId);
      }
    }

    this.logger.log(`Client disconnected: ${socketId} (User: ${userId})`);
  }

  // Room Management
  @SubscribeMessage(ClientEvents.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { roomId: string },
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      throw new WsException('User not authenticated');
    }

    const roomId = payload?.roomId;
    if (!roomId) {
      throw new WsException('Room ID is required');
    }

    // Ensure client has user data
    if (!client.handshake?.user) {
      throw new WsException('Unauthorized');
    }

    const joined = await this.joinRoom(userId, roomId);
    if (joined) {
      // Join the room
      await client.join(roomId);

      // Notify the client
      client.emit(ServerEvents.ROOM_JOINED, { 
        room: { id: roomId, name: roomId } as RoomInfo, 
        participants: [] // TODO: Add actual participants
      });

      // Notify others in the room
      client.to(roomId).emit(ServerEvents.USER_JOINED, client.handshake.user);

      this.logger.log(`User ${userId} joined room ${roomId}`);
    }
  }

  async joinRoom(userId: string, roomId: string): Promise<boolean> {
    if (!roomId) {
      throw new WsException('Room ID is required');
    }

    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }

    const room = this.roomUsers.get(roomId);
    if (room && !room.has(userId)) {
      room.add(userId);
      this.userRooms.get(userId)?.add(roomId);
      return true;
    }
    return false;
  }

  @SubscribeMessage(ClientEvents.LEAVE_ROOM)
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: { roomId: string },
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      throw new WsException('User not authenticated');
    }

    const roomId = payload?.roomId;
    if (!roomId) {
      throw new WsException('Room ID is required');
    }

    // Ensure client has user data
    if (!client.handshake?.user) {
      throw new WsException('Unauthorized');
    }

    const left = await this.leaveRoom(userId, roomId);
    if (left) {
      // Leave the room
      await client.leave(roomId);

      // Notify others in the room
      client.to(roomId).emit(ServerEvents.USER_LEFT, userId);

      this.logger.log(`User ${userId} left room ${roomId}`);
    }
  }

  async leaveRoom(userId: string, roomId: string): Promise<boolean> {
    if (!roomId) {
      throw new WsException('Room ID is required');
    }

    const room = this.roomUsers.get(roomId);
    if (room && room.has(userId)) {
      room.delete(userId);
      this.userRooms.get(userId)?.delete(roomId);
      if (room.size === 0) {
        this.roomUsers.delete(roomId);
      }
      return true;
    }
    return false;
  }

  // Track Updates
  @SubscribeMessage(ClientEvents.TRACK_UPDATE)
  async handleTrackUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() update: TrackUpdate,
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      throw new WsException('User not found');
    }

    if (!update.roomId) {
      throw new WsException('Room ID is required');
    }

    // Ensure client has user data
    if (!client.handshake?.user) {
      throw new WsException('Unauthorized');
    }

    // Add user and timestamp to the update
    const trackUpdate: TrackUpdate = {
      ...update,
      userId,
      timestamp: Date.now(),
    };

    // Broadcast the update to all clients in the room except the sender
    client.to(update.roomId).emit(ServerEvents.TRACK_UPDATE, trackUpdate);
  }

  // Presence Updates
  @SubscribeMessage(ClientEvents.PRESENCE_UPDATE)
  async handlePresenceUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() update: PresenceUpdate,
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      throw new WsException('User not found');
    }

    // Ensure client has user data
    if (!client.handshake?.user) {
      throw new WsException('Unauthorized');
    }

    this.userPresence.set(userId, update.status === 'online');

    // Get the current room from the client's rooms
    const rooms = Array.from(client.rooms).filter(room => room !== client.id);
    const currentRoom = rooms.length > 0 ? rooms[0] : null;

    // Broadcast the presence update to all clients in the room
    if (currentRoom) {
      const presenceUpdate: PresenceUpdate = {
        userId,
        status: update.status,
        lastSeen: update.lastSeen || new Date(),
        currentRoom,
      };

      client.to(currentRoom).emit(ServerEvents.PRESENCE_UPDATE, presenceUpdate);
    }
  }

  // WebRTC Signaling
  @SubscribeMessage(ClientEvents.SIGNAL)
  async handleSignal(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() signal: SignalingMessage,
  ) {
    const fromUserId = this.socketToUser.get(client.id);
    if (!fromUserId) {
      throw new WsException('User not authenticated');
    }

    if (!signal.to) {
      throw new WsException('Recipient ID is required');
    }

    // Find the recipient's socket
    const recipientSocket = this.findSocketByUserId(signal.to);
    if (!recipientSocket) {
      throw new WsException('Recipient not found');
    }

    // Create a new signal object with the sender's ID
    const signalingMessage: SignalingMessage = {
      ...signal,
      from: fromUserId,
    };

    // Forward the signal to the recipient
    recipientSocket.emit(ServerEvents.SIGNAL, signalingMessage);
  }

  private findSocketByUserId(userId: string): AuthenticatedSocket | undefined {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      const socketId = userSockets.values().next().value;
      if (socketId) {
        const socket = this.server.sockets.sockets.get(socketId) as unknown as AuthenticatedSocket;
        return socket;
      }
    }
    return undefined;
  }

  public async emitToUser<T>(userId: string, event: string, payload: T): Promise<boolean> {
    try {
      const server = this.getServer();
      const userSockets = this.userSockets.get(userId);
      
      if (!userSockets || userSockets.size === 0) {
        this.logger.warn(`No active sockets found for user ${userId}`);
        return false;
      }

      let success = false;
      for (const socketId of userSockets) {
        try {
          const socket = server.sockets.sockets.get(socketId) as unknown as AuthenticatedSocket;
          if (socket && socket.connected) {
            socket.emit(event, payload);
            success = true;
          }
        } catch (error) {
          this.logger.error(`Error emitting to socket ${socketId}:`, error);
        }
      }

      if (!success) {
        this.logger.warn(`Failed to emit to any socket for user ${userId}`);
      }
      return success;
    } catch (error) {
      this.logger.error('Error in emitToUser:', error);
      return false;
    }
  }

  // Clean up on module destroy
  onModuleDestroy() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }
}
