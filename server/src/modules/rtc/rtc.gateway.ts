import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';

export interface AuthenticatedSocket extends Socket {
  user: { sub: string; [key: string]: any };
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
  @WebSocketServer() server: Server;
  
  // Allow other gateways to register their server instance
  registerWsServer(server: Server) {
    this.server = server;
  }
  private readonly logger = new Logger(RtcGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set<socketId>
  private socketToUser = new Map<string, string>(); // socketId -> userId

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    if (!this.server) {
      this.logger.error('WebSocket server not initialized');
      client.disconnect();
      return;
    }
    
    const userId = client.user?.sub;
    if (!userId) {
      client.disconnect();
      return;
    }

    try {
      // Join the user's room
      await client.join(userId);
      
      // Initialize user's socket set if it doesn't exist
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }

      // Add socket to user's socket set
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        userSockets.add(client.id);
        this.socketToUser.set(client.id, userId);
      } else {
        this.logger.warn(`Failed to find user sockets for user ${userId}`);
      }

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
      this.logger.debug(`Total users: ${this.userSockets.size}, Total connections: ${this.socketToUser.size}`);
    } catch (error) {
      this.logger.error(`Error during connection handling: ${error.message}`, error.stack);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) return;

    // Remove socket from user's socket set
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.delete(client.id);
      
      // If user has no more sockets, remove the user entry
      if (userSockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.socketToUser.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
  }

  emitToUser(userId: string, event: string, payload: any) {
    if (!this.server || !('sockets' in this.server)) {
      this.logger.warn('WebSocket server not properly initialized');
      return false;
    }

    const userSockets = this.userSockets.get(userId);
    if (!userSockets) {
      this.logger.warn(`Attempted to emit to user ${userId} but no sockets found`);
      return false;
    }

    let emitted = false;
    for (const socketId of userSockets) {
      const socket = this.server.sockets.sockets.get(socketId);
      if (socket) {
        socket.emit(event, payload);
        emitted = true;
      }
    }

    if (!emitted) {
      this.logger.warn(`Failed to emit to any socket for user ${userId}`);
    }

    return emitted;
  }
}
