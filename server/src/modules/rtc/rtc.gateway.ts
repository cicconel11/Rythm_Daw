import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket as BaseSocket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from '../../auth/guards/jwt-ws-auth.guard';

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
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.com']
      : ['http://localhost:3000'],
    credentials: true,
  },
})
@UseGuards(JwtWsAuthGuard)
export class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server<any, any, any, AuthenticatedSocket>;
  
  private readonly logger = new Logger(RtcGateway.name);
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
    const userId = this.socketToUser.get(client.id);
    if (!userId) return;

    // Remove socket from user's socket set
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

  /* ---------- public helpers used only by tests ---------- */
  
  /**
   * Gets the map of user IDs to their socket IDs
   * @returns Map of user IDs to Set of socket IDs
   */
  getUserSockets() { 
    return this.userSockets; 
  }
  
  /**
   * Gets the map of socket IDs to user IDs
   * @returns Map of socket IDs to user IDs
   */
  getSocketToUser() { 
    return this.socketToUser; 
  }
  
  /**
   * Gets the logger instance
   * @returns The logger instance
   */
  getLogger() { 
    return this.logger; 
  }
  
  /**
   * Registers a WebSocket server instance
   * @param server - The WebSocket server instance
   */
  registerWsServer(server: Server) { 
    this.server = server; 
  }

  /**
   * Emits an event to all sockets associated with a specific user
   * @param userId - The ID of the user to emit to
   * @param event - The event name to emit
   * @param payload - The data to send with the event
   * @returns boolean - True if the event was emitted to at least one socket
   */
  public emitToUser(userId: string, event: string, payload: any): boolean {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0 || !this.server?.sockets?.sockets) {
      this.logger.warn(
        `Attempted to emit to user ${userId} but no sockets found`,
        RtcGateway.name,
      );
      return false;
    }

    let success = false;
    const socketsToRemove: string[] = [];
    
    sockets.forEach(socketId => {
      try {
        const socket = this.server.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit(event, payload);
          success = true;
        } else {
          // Queue for removal if socket not found
          socketsToRemove.push(socketId);
        }
      } catch (error) {
        this.logger.error(`Error emitting to socket ${socketId}:`, error);
        socketsToRemove.push(socketId);
      }
    });
    
    // Clean up any dead sockets
    if (socketsToRemove.length > 0) {
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        socketsToRemove.forEach(socketId => {
          userSockets.delete(socketId);
          this.socketToUser.delete(socketId);
        });
        
        // Remove user entry if no sockets left
        if (userSockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
    
    return success;
  }
}
