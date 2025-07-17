import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, Inject, forwardRef } from '@nestjs/common';

import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { AuthService } from '../auth/auth.service';
import { WsThrottlerGuard } from './guards/ws-throttler.guard';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../presence/presence.service';
import { MessageQueue } from './message-queue';
import { 
  ClientEvents, 
  ServerEvents, 
  InterServerEvents, 
  SocketData 
} from './types/websocket.types';

export interface WebSocketClient extends Socket {
  id: string;
  userId: string;
  projectId?: string;
  isAlive: boolean;
  lastPing?: number;
  emit: (event: string, ...args: any[]) => boolean;
  queue?: MessageQueue;
}

@WebSocketGateway({
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://your-production-domain.com'] 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
  namespace: 'chat',
  pingInterval: 30000,
  pingTimeout: 10000,
})
@UseGuards(JwtWsAuthGuard, WsThrottlerGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(ChatGateway.name);
  private readonly rateLimiter: RateLimiterMemory;
  private readonly clientQueues = new Map<string, MessageQueue>();
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly heartbeatIntervals = new Map<string, NodeJS.Timeout>();
  private readonly MAX_QUEUE_SIZE = 100; // Max messages in queue before backpressure

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly presenceService: PresenceService
  ) {
    this.rateLimiter = new RateLimiterMemory({
      points: 100, // 100 messages
      duration: 1, // per second
    });
  }

  onModuleInit() {
    this.logger.log('ChatGateway initialized');
  }

  async handleConnection(client: WebSocketClient) {
    try {
      // Initialize message queue for this client
      const messageQueue = new MessageQueue(client);
      
      this.clientQueues.set(client.id, messageQueue);
      
      // Set up ping/pong handler
      client.isAlive = true;
      client.on('pong', () => {
        client.isAlive = true;
        client.lastPing = Date.now();
      });
      
      // Update presence
      this.presenceService.updateUserPresence(client.userId);
      
      this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);
    } catch (error) {
      this.logger.error('Error in handleConnection:', error);
      if (client.connected) {
        client.disconnect(true);
      }
    }
  }

  async handleDisconnect(client: WebSocketClient) {
    try {
      // Clean up message queue
      const queue = this.clientQueues.get(client.id);
      if (queue) {
        queue.stop();
        this.clientQueues.delete(client.id);
      }
      
      // Clean up heartbeat
      this.cleanupHeartbeat(client.id);
      
      // Remove presence on disconnect
      this.presenceService.removeUserPresence(client.userId);
      
      this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Disconnection error: ${errorMessage}`, errorStack);
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuth(
    @ConnectedSocket() client: WebSocketClient,
    @MessageBody() data: { token: string; projectId?: string },
  ) {
    try {
      const payload = await this.authService.verifyToken(data.token);
      if (!payload) {
        throw new Error('Invalid token');
      }

      client.userId = payload.sub;
      client.projectId = data.projectId;
      
      // Use emit instead of sendMessage
      client.emit('auth_success', { 
        type: 'auth_success',
        userId: client.userId,
        projectId: client.projectId,
      });

      this.logger.log(`Client authenticated: ${client.id} (User: ${client.userId})`);
    } catch (error) {
      this.logger.error(`Auth error: ${error.message}`);
      client.disconnect();
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: WebSocketClient,
    @MessageBody() data: { to: string; content: string; metadata?: Record<string, unknown> },
  ) {
    if (!data || !data.to || !data.content) {
      throw new Error('Invalid message format');
    }
    
    try {
      // Apply rate limiting
      await this.rateLimiter.consume(client.id);
      
      const timestamp = new Date().toISOString();
      const message = {
        from: client.userId,
        to: data.to,
        content: data.content,
        timestamp,
        ...(data.metadata || {})
      };
      
      // Handle room messages or direct messages
      if (data.to.startsWith('room:')) {
        // Broadcast to room
        this.server.to(data.to).emit('message', message);
      } else {
        // Find recipient's queue and enqueue message
        const recipientQueue = this.findRecipientQueue(data.to);
        if (recipientQueue) {
          recipientQueue.enqueue('message', message);
        } else {
          this.logger.warn(`Recipient ${data.to} not found`);
          // Notify sender that recipient is offline
          this.emitToClient(client.id, 'error', {
            code: 'RECIPIENT_OFFLINE',
            message: 'The recipient is not connected',
            recipientId: data.to,
            timestamp
          });
        }
      }
      
      return message;
    } catch (error) {
      this.logger.error('Error handling message:', error);
      throw error;
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: WebSocketClient,
    @MessageBody() data: { isTyping: boolean },
  ) {
    try {
      await this.rateLimiter.consume(client.id);
      
      // Broadcast typing status to all clients in the same project
      this.server.emit('userTyping', { 
        userId: client.userId, 
        isTyping: data.isTyping 
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : '';
      this.logger.error(`Typing error: ${errorMessage}`, errorStack);
    }
  }

  private emitToClient(clientId: string, event: string, data: unknown): void {
    const client = this.server.sockets.sockets.get(clientId) as WebSocketClient | undefined;
    if (client) {
      client.emit(event, data);
    }
  }

  private getUserClients(userId: string): WebSocketClient[] {
    const clients: WebSocketClient[] = [];
    
    this.server.sockets.sockets.forEach((socket) => {
      const wsClient = socket as WebSocketClient;
      if (wsClient.userId === userId) {
        clients.push(wsClient);
      }
    });
    
    return clients;
  }

  async broadcastToProject(projectId: string, message: any) {
    const clients = this.getUserClients(projectId);
    
    await Promise.all(
      clients.map(client => {
        if (client.connected) {
          return new Promise<void>((resolve) => {
            client.emit('broadcast', message, () => {
              resolve();
            });
          }).catch(err => {
            this.logger.error(`Broadcast failed to ${client.id}: ${err.message}`);
          });
        }
        return Promise.resolve();
      })
    );
  }

  private cleanupHeartbeat(clientId: string): void {
    const interval = this.heartbeatIntervals.get(clientId);
    if (interval) {
      clearInterval(interval);
      this.heartbeatIntervals.delete(clientId);
    }
  }
  
  private findRecipientQueue(userId: string): MessageQueue | undefined {
    for (const [clientId, queue] of this.clientQueues.entries()) {
      const client = this.server.sockets.sockets.get(clientId) as WebSocketClient | undefined;
      if (client?.userId === userId) {
        return queue;
      }
    }
    return undefined;
  }

  onModuleDestroy() {
    // Clean up all heartbeat intervals
    this.heartbeatIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.heartbeatIntervals.clear();
    
    // Clean up all message queues
    this.clientQueues.forEach((queue) => {
      queue.stop();
    });
    this.clientQueues.clear();
  }
}
