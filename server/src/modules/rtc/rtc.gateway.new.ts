import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
  UseFilters,
  UseGuards,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, OnModuleInit } from '@nestjs/common';
import { JwtWsAuthGuard } from '../../auth/guards/jwt-ws-auth.guard';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import {
  ClientEvents,
  ServerEvents,
  UserInfo,
  TrackUpdate,
  PresenceUpdate,
  SignalingMessage,
} from './types/websocket.types';

// Extend Socket.IO types with our custom properties
declare module 'socket.io' {
  interface Handshake {
    user: UserInfo;
  }
}

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
@UseGuards(JwtWsAuthGuard)
@UseFilters(WsExceptionFilter)
export class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

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

  async handleConnection(client: Socket) {
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

  async handleDisconnect(client: Socket) {
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
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    const userId = this.socketToUser.get(client.id);

    if (!userId) {
      throw new WsException('User not authenticated');
    }

    // Join the room
    await client.join(roomId);

    // Update room tracking
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    this.roomUsers.get(roomId)?.add(userId);
    this.userRooms.get(userId)?.add(roomId);

    // Notify the client
    client.emit(ServerEvents.ROOM_JOINED, { roomId });

    // Notify others in the room
    client.to(roomId).emit(ServerEvents.USER_JOINED, {
      roomId,
      userId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`User ${userId} joined room ${roomId}`);
  }

  @SubscribeMessage(ClientEvents.LEAVE_ROOM)
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const { roomId } = data;
    const userId = this.socketToUser.get(client.id);

    if (!userId) {
      throw new WsException('User not authenticated');
    }

    await this.leaveRoom(userId, roomId);
  }

  private async leaveRoom(userId: string, roomId: string) {
    // Leave the room
    this.server.in(roomId).socketsLeave(userId);

    // Update room tracking
    this.roomUsers.get(roomId)?.delete(userId);
    this.userRooms.get(userId)?.delete(roomId);

    // Clean up empty rooms
    if (this.roomUsers.get(roomId)?.size === 0) {
      this.roomUsers.delete(roomId);
    }

    // Notify others in the room
    this.server.to(roomId).emit(ServerEvents.USER_LEFT, {
      roomId,
      userId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`User ${userId} left room ${roomId}`);
  }

  // Track Updates
  @SubscribeMessage(ClientEvents.TRACK_UPDATE)
  async handleTrackUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() update: TrackUpdate,
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      throw new WsException('User not authenticated');
    }

    // Add user and timestamp to the update
    const trackUpdate: TrackUpdate = {
      ...update,
      userId,
      timestamp: Date.now(),
    };

    // Broadcast to all clients in the room except the sender
    client.to(update.roomId).emit(ServerEvents.TRACK_UPDATE, trackUpdate);
  }

  // Presence Updates
  @SubscribeMessage(ClientEvents.PRESENCE_UPDATE)
  async handlePresenceUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() update: PresenceUpdate,
  ) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) {
      throw new WsException('User not authenticated');
    }

    this.userPresence.set(userId, update.status === 'online');
    this.lastSeen.set(userId, new Date());

    // Notify all rooms the user is in
    const userRooms = this.userRooms.get(userId) || new Set();
    userRooms.forEach(roomId => {
      this.server.to(roomId).emit(ServerEvents.PRESENCE_UPDATE, {
        userId,
        status: update.status,
        lastSeen: this.lastSeen.get(userId),
      });
    });
  }

  // WebRTC Signaling
  @SubscribeMessage('signal')
  async handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() signal: SignalingMessage,
  ) {
    const fromUserId = this.socketToUser.get(client.id);
    if (!fromUserId) {
      throw new WsException('User not authenticated');
    }

    // Find the target user's sockets
    const targetSockets = this.userSockets.get(signal.to) || new Set();
    if (targetSockets.size === 0) {
      throw new WsException('Target user not found or offline');
    }

    // Forward the signal to all of the target's sockets
    const signalWithFrom = { ...signal, from: fromUserId };
    targetSockets.forEach(socketId => {
      const targetSocket = this.server.sockets.sockets.get(socketId);
      if (targetSocket) {
        targetSocket.emit('signal', signalWithFrom);
      }
    });
  }

  // Health check endpoint
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    const socketId = client.id;
    this.missedPings.set(socketId, 0);
    client.emit('pong', { timestamp: Date.now() });
  }

  // Clean up on module destroy
  onModuleDestroy() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }
}
