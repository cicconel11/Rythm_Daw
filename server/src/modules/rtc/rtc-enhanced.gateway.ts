import { Logger, UseFilters, UseGuards, OnModuleInit } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { JwtWsAuthGuard } from '../../auth/guards/jwt-ws-auth.guard';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { WsThrottlerGuard } from '../../common/guards/ws-throttler.guard';
import { ClientEvents, ServerEvents, UserInfo, TrackUpdate, PresenceUpdate, SignalingMessage } from './types/websocket.types';

@WebSocketGateway(8080, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
  pingInterval: 10000,
  pingTimeout: 5000,
  allowEIO3: true,
})
@UseGuards(JwtWsAuthGuard, WsThrottlerGuard)
@UseFilters(WsExceptionFilter)
export class RtcEnhancedGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  private server: Server;
  private readonly logger = new Logger(RtcEnhancedGateway.name);
  private readonly activeUsers = new Map<string, UserInfo>();
  private readonly userSockets = new Map<string, string>();
  private readonly roomUsers = new Map<string, Set<string>>();

  onModuleInit() {
    this.logger.log('RTC Enhanced WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const user = client.handshake?.user as UserInfo;
      if (!user?.userId) {
        this.logger.warn('Connection attempt without valid user');
        client.disconnect(true);
        return;
      }

      // Store user connection
      this.activeUsers.set(user.userId, user);
      this.userSockets.set(client.id, user.userId);

      this.logger.log(`Client connected: ${client.id} (User: ${user.userId})`);
      
      // Send welcome message
      client.emit(ServerEvents.CONNECT, {
        message: 'Connected to RTC server',
        userId: user.userId,
        timestamp: new Date().toISOString(),
      });

      // Notify others about new user
      client.broadcast.emit(ServerEvents.USER_JOINED, {
        userId: user.userId,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      this.logger.error('Connection error:', error);
      client.emit(ServerEvents.ERROR, {
        status: 'error',
        message: 'Connection error',
        error: error.message,
      });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.userSockets.get(client.id);
    if (userId) {
      this.activeUsers.delete(userId);
      this.userSockets.delete(client.id);
      
      // Remove user from all rooms
      this.roomUsers.forEach((users, roomId) => {
        if (users.has(userId)) {
          users.delete(userId);
          client.to(roomId).emit(ServerEvents.USER_LEFT, {
            userId,
            roomId,
            timestamp: new Date().toISOString(),
          });
        }
      });

      this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }
  }

  @SubscribeMessage(ClientEvents.JOIN_ROOM)
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const user = client.handshake?.user as UserInfo;
    if (!user?.userId) {
      throw new WsException('Unauthorized');
    }

    const { roomId } = data;
    if (!roomId) {
      throw new WsException('Room ID is required');
    }

    // Join the room
    await client.join(roomId);
    
    // Track room membership
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    this.roomUsers.get(roomId).add(user.userId);

    // Get current room users
    const roomUsers = Array.from(this.roomUsers.get(roomId))
      .filter(id => id !== user.userId)
      .map(id => this.activeUsers.get(id))
      .filter(Boolean);

    // Notify the client they've joined
    client.emit(ServerEvents.ROOM_JOINED, {
      roomId,
      users: roomUsers,
      timestamp: new Date().toISOString(),
    });

    // Notify others in the room
    client.to(roomId).emit(ServerEvents.USER_JOINED, {
      userId: user.userId,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
      },
      roomId,
      timestamp: new Date().toISOString(),
    });

    return { success: true, roomId };
  }

  @SubscribeMessage(ClientEvents.LEAVE_ROOM)
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const user = client.handshake?.user as UserInfo;
    if (!user?.userId) {
      throw new WsException('Unauthorized');
    }

    const { roomId } = data;
    if (!roomId) {
      throw new WsException('Room ID is required');
    }

    // Leave the room
    await client.leave(roomId);
    
    // Update room membership
    if (this.roomUsers.has(roomId)) {
      this.roomUsers.get(roomId).delete(user.userId);
    }

    // Notify others in the room
    client.to(roomId).emit(ServerEvents.USER_LEFT, {
      userId: user.userId,
      roomId,
      timestamp: new Date().toISOString(),
    });

    return { success: true, roomId };
  }

  @SubscribeMessage(ClientEvents.TRACK_UPDATE)
  async handleTrackUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() update: TrackUpdate,
  ) {
    const user = client.handshake?.user as UserInfo;
    if (!user?.userId) {
      throw new WsException('Unauthorized');
    }

    // Add user and timestamp to the update
    const trackUpdate: TrackUpdate = {
      ...update,
      userId: user.userId,
      timestamp: Date.now(),
    };

    // Broadcast to all clients in the room except sender
    client.to(update.roomId).emit(ServerEvents.TRACK_UPDATE, trackUpdate);
    
    return { success: true };
  }

  @SubscribeMessage(ClientEvents.SIGNAL)
  async handleSignal(
    @ConnectedSocket() client: Socket,
    @MessageBody() signal: SignalingMessage,
  ) {
    const user = client.handshake?.user as UserInfo;
    if (!user?.userId) {
      throw new WsException('Unauthorized');
    }

    // Forward the signal to the target user
    const targetSocketId = this.findSocketIdByUserId(signal.to);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit(ServerEvents.SIGNAL, {
        ...signal,
        from: user.userId,
      });
    }

    return { success: true };
  }

  @SubscribeMessage(ClientEvents.PING)
  async handlePing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { timestamp: number },
  ) {
    // Simple ping-pong for connection health check
    return { 
      event: ServerEvents.PONG,
      originalTimestamp: data.timestamp,
      serverTimestamp: Date.now(),
    };
  }

  private findSocketIdByUserId(userId: string): string | undefined {
    for (const [socketId, id] of this.userSockets.entries()) {
      if (id === userId) {
        return socketId;
      }
    }
    return undefined;
  }
}
