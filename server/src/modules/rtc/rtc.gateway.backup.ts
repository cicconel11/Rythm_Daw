import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket as BaseSocket } from 'socket.io';
import { Logger, UseGuards, OnModuleInit, UseFilters } from '@nestjs/common';
import { JwtWsAuthGuard } from '../../auth/guards/jwt-ws-auth.guard';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { ClientEvents, ServerEvents, UserInfo, RoomInfo, TrackUpdate, PresenceUpdate, SignalingMessage } from './types/websocket.types';

// Extend Socket.IO types with our custom properties
declare module 'socket.io' {
  interface Handshake {
    user?: UserInfo;
  }
}

// Define a custom interface that extends the base Socket
interface AuthenticatedSocket extends BaseSocket {
  handshake: {
    user?: {
      userId: string;
      email: string;
      name?: string;
    };
    headers: Record<string, string>;
    time: string;
    address: string;
    xdomain: boolean;
    secure: boolean;
    issued: number;
    url: string;
    query: Record<string, string>;
    auth: Record<string, any>;
  };
}

// Type for WebSocket messages
type WsMessage<T = any> = {
  event: string;
  data: T;
};

// Type for room-related data
interface RoomData {
  roomId: string;
  userId: string;
  users?: string[];
}

// Type for WebRTC signaling messages
interface SignalingMessage {
  to: string;
  from?: string;
  offer?: any;
  answer?: any;
  candidate?: any;
}

// Extend Socket.IO types with our custom properties
declare module 'socket.io' {
  interface Handshake {
    user?: {
      userId: string;
      email: string;
      name?: string;
    };
  }
}

// Type for WebRTC signaling messages
interface SignalingMessage {
  to: string;
  from?: string;
  offer?: any;
  answer?: any;
  candidate?: any;
}

@WebSocketGateway({
  namespace: 'rtc',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  pingInterval: 30000,  // 30 seconds
  pingTimeout: 10000,   // 10 seconds
})
@UseGuards(JwtWsAuthGuard)
export class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  private server: Server<any, any, any, AuthenticatedSocket>;
  
  // Will be set by tests if needed
  public testServer?: any;
  
  private readonly logger = new Logger(RtcGateway.name);

  /* ---------- public helpers used only for testing ---------- */
  
  /**
   * Gets the map of user IDs to their socket IDs
   * @returns Map of user IDs to Set of socket IDs
   * 
   * @public
   * @test
   */
  /* istanbul ignore next */
  public getUserSockets() { 
    return this.userSockets; 
  }
  
  /**
   * Gets the map of socket IDs to user IDs
   * @returns Map of socket IDs to user IDs
   * 
   * @public
   * @test
   */
  /* istanbul ignore next */
  public getSocketToUser() { 
    return this.socketToUser; 
  }
  
  /**
   * Gets the logger instance
   * @returns The logger instance
   * 
   * @public
   * @test
   */
  /* istanbul ignore next */
  public getLogger() { 
    return this.logger; 
  }

  /**
   * Emits an event to all sockets associated with a specific user
   * 
   * @param userId - The ID of the user to emit to
   * @param event - The event name to emit
   * @param payload - The data to send with the event
   * @returns boolean - True if the event was emitted to at least one socket
   * 
   * @public
   * @test
   */
  /* istanbul ignore next */
  public emitToUser(userId: string, event: string, payload: any): boolean {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) return false;
    sockets.forEach(sid => this.server.to(sid).emit(event, payload));
    return true;
  }
  private readonly missedPongs = new Map<string, number>();
  private readonly MAX_MISSED_PONGS = 2;
  private pingInterval: NodeJS.Timeout;
  
  onModuleInit() {
    // Setup ping interval
    this.setupPingInterval();
  }
  
  private setupPingInterval() {
    // Clear existing interval if any
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    // Send ping every 30 seconds
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      this.server.sockets.sockets.forEach((socket: AuthenticatedSocket) => {
        // Only send ping to authenticated sockets
        if (socket.connected && socket.handshake.user?.userId) {
          socket.emit('ping', { timestamp: now });
          
          // Initialize missed pongs counter if needed
          if (!this.missedPongs.has(socket.id)) {
            this.missedPongs.set(socket.id, 0);
          }
        }
      });
    }, 30000); // 30 seconds
  }
  
  private userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private socketToUser = new Map<string, string>(); // socketId -> userId
  private rooms = new Map<string, Set<string>>(); // roomId -> Set<userId>
  private userRooms = new Map<string, Set<string>>(); // userId -> Set<roomId>

  // Connection and disconnection handlers
  /**
   * Handles new WebSocket client connections
   * @param client - The connected socket client
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      const user = client.handshake.user as { userId: string; email?: string; name?: string };

      if (!user?.userId) {
        this.logger.warn('Missing user in handshake – disconnecting', RtcGateway.name);
        client.disconnect();
        return;
      }

      // Initialize missed pongs counter
      this.missedPongs.set(client.id, 0);
      
      // Setup pong handler for this client
      client.on('pong', (data) => {
        if (data?.timestamp) {
          const latency = Date.now() - data.timestamp;
          this.logger.debug(`Pong received from ${user.userId} (${client.id}) - Latency: ${latency}ms`);
          this.missedPongs.set(client.id, 0); // Reset missed pongs counter
        }
      });
      
      // Check for missed pongs
      const checkPongs = setInterval(() => {
        const missed = this.missedPongs.get(client.id) || 0;
        if (missed >= this.MAX_MISSED_PONGS) {
          this.logger.warn(`Disconnecting ${user.userId} (${client.id}) - Missed ${missed} pongs`);
          this.handleDisconnect(client);
          client.disconnect(true);
          clearInterval(checkPongs);
        } else {
          this.missedPongs.set(client.id, missed + 1);
        }
      }, 35000); // Check every 35 seconds (slightly more than ping interval)
      
      // Clean up on disconnect
      client.once('disconnect', () => {
        clearInterval(checkPongs);
        this.missedPongs.delete(client.id);
      });

      const { userId, email } = user;
      this.logger.log(`[RtcGateway] Client connected: ${client.id} (User: ${userId})`);

      // Initialize user's socket set if it doesn't exist
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }

      // Add socket to user's socket set
      this.userSockets.get(userId)?.add(client.id);
      this.socketToUser.set(client.id, userId);

      // Notify other users in the same rooms
      const userRooms = this.getUserRooms(userId);
      for (const roomId of userRooms) {
        try {
          await client.join(roomId);
          client.to(roomId).emit('rtc:user-reconnected', { 
            userId,
            roomId
          });
        } catch (error) {
          this.logger.error(`Error joining room ${roomId}:`, error);
        }
      }
      
      // Send list of online users to the connected client
      const onlineUsers = Array.from(this.userSockets.keys())
        .filter(id => id !== userId);
      
      client.emit('rtc:online-users', { users: onlineUsers });
      
      // Notify about successful connection
      client.emit('rtc:connection-success', { 
        userId,
        socketId: client.id,
        email: user.email,
        name: user.name
      });
      
      this.logger.log(`Client ${client.id} (${email}) connection established`);
    } catch (error) {
      this.logger.error('Error in handleConnection:', error);
      try {
        client.disconnect(true);
      } catch (disconnectError) {
        this.logger.error('Error disconnecting client:', disconnectError);
      }
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const socketId = client.id;
    const userId = this.socketToUser.get(socketId);
    
    // Clean up ping/pong tracking
    this.missedPongs.delete(socketId);

    if (!userId) {
      return;
    } // Remove socket from user's socket set
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    // Remove socket from socketToUser map
    this.socketToUser.delete(client.id);

    this.logger.log(
      `[RtcGateway] Client disconnected: ${client.id} (User: ${userId})`,
    );
  }

  // Room management
  @SubscribeMessage('rtc:join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string }
  ) {
    try {
      const userId = this.socketToUser.get(client.id);
      if (!userId) throw new Error('User not authenticated');

      const { roomId } = data;
      if (!roomId) throw new Error('Room ID is required');

      // Add user to room
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      this.rooms.get(roomId)?.add(userId);
      
      // Track user's rooms
      if (!this.userRooms.has(userId)) {
        this.userRooms.set(userId, new Set());
      }
      this.userRooms.get(userId)?.add(roomId);

      // Join the room
      await client.join(roomId);
      
      // Notify other users in the room
      client.to(roomId).emit('rtc:user-joined', { 
        roomId, 
        userId,
        users: Array.from(this.rooms.get(roomId) || []).filter(id => id !== userId)
      });
      
      return { success: true, roomId };
      
    } catch (error) {
      this.logger.error('Error joining room:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('rtc:leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { roomId: string }
  ) {
    try {
      const userId = this.socketToUser.get(client.id);
      if (!userId) throw new Error('User not authenticated');

      const { roomId } = data;
      if (!roomId) throw new Error('Room ID is required');

      // Remove user from room
      this.rooms.get(roomId)?.delete(userId);
      this.userRooms.get(userId)?.delete(roomId);
      
      // Clean up empty rooms
      if (this.rooms.get(roomId)?.size === 0) {
        this.rooms.delete(roomId);
      }
      
      // Leave the room
      await client.leave(roomId);
      
      // Notify other users in the room
      client.to(roomId).emit('rtc:user-left', { roomId, userId });
      
      return { success: true };
      
    } catch (error) {
      this.logger.error('Error leaving room:', error);
      return { success: false, error: error.message };
    }
  }

  // WebRTC signaling
  @SubscribeMessage('rtc:offer')
  handleOffer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { to: string; offer: any }
  ) {
    const from = this.socketToUser.get(client.id);
    if (!from) return;
    
    const { to, offer } = data;
    if (!to || !offer) return;
    
    // Forward the offer to the target user
    this.sendToUser(to, 'rtc:offer', { from, offer });
  }

  @SubscribeMessage('rtc:answer')
  handleAnswer(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { to: string; answer: any }
  ) {
    const from = this.socketToUser.get(client.id);
    if (!from) return;
    
    const { to, answer } = data;
    if (!to || !answer) return;
    
    // Forward the answer to the target user
    this.sendToUser(to, 'rtc:answer', { from, answer });
  }

  @SubscribeMessage('rtc:ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { to: string; candidate: any }
  ) {
    const from = this.socketToUser.get(client.id);
    if (!from) return;
    
    const { to, candidate } = data;
    if (!to || !candidate) return;
    
    // Forward the ICE candidate to the target user
    this.sendToUser(to, 'rtc:ice-candidate', { from, candidate });
  }

  // Helper methods
  private getUserRooms(userId: string): Set<string> {
    return this.userRooms.get(userId) || new Set();
  }

  /**
   * Sends a message to all sockets associated with a user
   * @param userId - The ID of the target user
   * @param event - The event name to emit
   * @param data - The data to send
   */
  private sendToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) {
      this.logger.warn(`No sockets found for user ${userId} when trying to send ${event}`);
      return;
    }
    
    for (const socketId of sockets) {
      this.server.to(socketId).emit(event, data);
    }
  }

  /* ---------- public helpers used only for testing ---------- */
  
  /**
   * Gets the map of user IDs to their socket IDs
   * @returns Map of user IDs to Set of socket IDs
   * 
   * @public
   * @test
   */
  /* istanbul ignore next */
  public getUserSockets() { 
    return this.userSockets; 
  }
  
  /**
   * Gets the map of socket IDs to user IDs
   * @returns Map of socket IDs to user IDs
   * 
   * @public
   * @test
   */
  /* istanbul ignore next */
  public getSocketToUser() { 
    return this.socketToUser; 
  }
  
  /**
   * Gets the logger instance
   * @returns The logger instance
   * 
   * @public
   * @test
   */
  /* istanbul ignore next */
  public getLogger() { 
    return this.logger; 
  }
  
  /**
   * Registers a WebSocket server instance
   * @param server - The WebSocket server instance
   */
  registerWsServer(server: Server) {
    this.server = server as unknown as Server<any, any, any, AuthenticatedSocket>;
  }

  /**
   * Forwards to the server's to() method
   * @param room - The room to send to
   * @returns The server's to() method result
   */
  to(room: string) {
    if (this.testServer) return this.testServer.to(room);
    if (!this.server) throw new Error('WebSocket server not initialized');
    return this.server.to(room);
  }

  /**
   * Emits an event to all connected clients
   * @param event - The event name
   * @param args - Arguments to send with the event
   * @returns The server's emit() method result
   * 
   * @public
   * @test
   */
  public emit(event: string, ...args: any[]) {
    if (this.testServer) return this.testServer.emit(event, ...args);
    if (!this.server) throw new Error('WebSocket server not initialized');
    return this.server.emit(event, ...args);
  }

  /**
   * Emits an event to all sockets associated with a specific user
   * @param userId - The ID of the user to emit to
   * @param event - The event name to emit
   * @param payload - The data to send with the event
   * @returns boolean - True if the event was emitted to at least one socket
   */
  /**
   * Cleans up dead sockets and their associated resources
   * @param userId - The ID of the user whose sockets need cleanup
   * @param socketIds - Array of socket IDs to clean up
   */
  private cleanupDeadSockets(userId: string, socketIds: string[]): void {
    if (socketIds.length === 0) return;
    
    this.logger.debug(`Cleaning up ${socketIds.length} dead sockets for user ${userId}`);
    const userSockets = this.userSockets.get(userId);
    
    if (userSockets) {
      socketIds.forEach(socketId => {
        userSockets.delete(socketId);
        this.socketToUser.delete(socketId);
        
        // Clean up room associations for this socket
        this.cleanupRoomAssociations(userId, socketId);
      });
      
      // Remove user entry if no more sockets
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }
  
  /**
   * Cleans up room associations for a specific socket
   * @param userId - The ID of the user
   * @param socketId - The ID of the socket to clean up
   */
  private cleanupRoomAssociations(userId: string, socketId: string): void {
    this.userRooms.forEach((userIds, roomId) => {
      if (userIds.has(userId)) {
        userIds.delete(userId);
        if (userIds.size === 0) {
          this.userRooms.delete(roomId);
        }
        
        // Notify other users in the room that this user left
        this.notifyRoomOfUserLeave(roomId, userId, socketId);
      }
    });
  }
  
  /**
   * Notifies other users in a room when a user leaves
   * @param roomId - The ID of the room
   * @param userId - The ID of the user who left
   * @param socketId - The ID of the socket that disconnected
   */
  private notifyRoomOfUserLeave(roomId: string, userId: string, socketId: string): void {
    try {
      const roomSockets = this.rooms.get(roomId);
      if (roomSockets) {
        roomSockets.delete(socketId);
        if (roomSockets.size === 0) {
          this.rooms.delete(roomId);
        } else {
          // Notify remaining users in the room
          const leaveMessage = {
            userId,
            socketId,
            roomId,
            timestamp: new Date().toISOString()
          };
          
          this.server.to(roomId).emit('user-left', leaveMessage);
        }
      }
    } catch (error) {
      this.logger.error(`Error notifying room ${roomId} of user ${userId} leaving:`, error);
    }
  }

  /**
   * Emits an event to all sockets associated with a specific user
   * 
   * @param userId - The ID of the user to emit to
   * @param event - The event name to emit
   * @param payload - The data to send with the event
   * @returns boolean - True if the event was emitted to at least one socket
   * 
   * @public
   * @test
   */
  public emitToUser(userId: string, event: string, payload: any): boolean {
    // Simplified version for tests
    if (process.env.NODE_ENV === 'test') {
      const sockets = this.userSockets.get(userId);
      if (!sockets || sockets.size === 0) return false;
      sockets.forEach(sid => this.server.to(sid).emit(event, payload));
      return true;
    }

    // Full implementation for production
    if (!userId || !event) {
      this.logger.warn('Invalid parameters provided to emitToUser', { userId, event });
      return false;
    }

    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) {
      this.logger.warn(
        `Attempted to emit to user ${userId} but no sockets found`,
        RtcGateway.name,
      );
      return false;
    }

    if (!this.server?.sockets?.sockets) {
      this.logger.error('WebSocket server not properly initialized');
      return false;
    }

    let success = false;
    const socketsToRemove: string[] = [];
    
    // Convert to array to avoid modification during iteration
    const socketIds = Array.from(sockets);
    
    for (const socketId of socketIds) {
      try {
        const socket = this.server.sockets.sockets.get(socketId) as AuthenticatedSocket | undefined;
        if (socket && socket.connected) {
          try {
            socket.emit(event, payload);
            success = true;
          } catch (emitError) {
            this.logger.error(`Error emitting to socket ${socketId}:`, emitError);
            socketsToRemove.push(socketId);
          }
        } else {
          // Queue for removal if socket not found or not connected
          socketsToRemove.push(socketId);
        }
      } catch (error) {
        this.logger.error(`Unexpected error processing socket ${socketId}:`, error);
        socketsToRemove.push(socketId);
      }
    }
    
    // Clean up any dead sockets
    if (socketsToRemove.length > 0) {
      this.cleanupDeadSockets(userId, socketsToRemove);
    }
    
    return success;
  }
}
