import { 
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { AuthService } from '../auth/auth.service';
import { WsThrottlerGuard } from './guards/ws-throttler.guard';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../presence/presence.service';

interface WebSocketClient extends WebSocket {
  id: string;
  userId?: string;
  projectId?: string;
  isAlive: boolean;
  sendMessage: (data: any) => Promise<void>;
}

@NestWebSocketGateway({
  path: '/ws/chat',
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://rhythm.app', 'https://www.rhythm.app']
      : '*',
  },
})
@UseGuards(JwtWsAuthGuard, WsThrottlerGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger('ChatGateway');
  /** Keyed by WebSocket instance so we can delete via same reference */
  private readonly clients = new Map<WebSocketClient, WebSocketClient>();
  private readonly rateLimiter = new RateLimiterMemory({
    points: 100, // 100 messages
    duration: 1, // per second
  });
  private readonly heartbeatInterval: NodeJS.Timeout;
  private readonly MAX_QUEUE_SIZE = 100; // Max messages in queue before backpressure
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly presenceService: PresenceService
  ) {
    // Setup heartbeat to detect dead connections
    this.heartbeatInterval = setInterval(() => this.checkHeartbeat(), this.HEARTBEAT_INTERVAL);
  }

  cleanup() {
    // Clean up any resources
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    // Close all client connections
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.terminate();
      }
    });
    this.clients.clear();
  }

  async handleConnection(client: WebSocketClient) {
    try {
      // Generate unique ID for the connection
      client.id = Math.random().toString(36).substring(2, 15);
      client.isAlive = true;
      
      // Setup heartbeat
      client.on('pong', () => {
        client.isAlive = true;
      });

      // Setup backpressure handling
      client.sendMessage = async (data: any) => {
        return new Promise<void>((resolve, reject) => {
          if (client.readyState !== WebSocket.OPEN) {
            return reject(new Error('WebSocket not open'));
          }

          // Check backpressure
          if (client.bufferedAmount > this.MAX_QUEUE_SIZE * 1024) { // 100KB
            client.pause();
            client.once('drain', () => {
              client.resume();
              client.send(JSON.stringify(data), (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          } else {
            client.send(JSON.stringify(data), (err) => {
              if (err) reject(err);
              else resolve();
            });
          }
        });
      };

      this.clients.set(client, client);
      this.logger.log(`Client connected: ${client.id}`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`, error.stack);
      client.terminate();
    }
  }

  async handleDisconnect(client: WebSocketClient) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Remove client from presence tracking
    if (client.userId) {
      try {
        await this.presenceService.removeUserPresence(client.userId);
      } catch (error) {
        this.logger.error(`Error removing user presence: ${error.message}`, error.stack);
      }
    }
    
    // Remove client from clients map
    this.clients.delete(client);
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
      
      await client.sendMessage({ 
        type: 'auth_success',
        userId: client.userId,
        projectId: client.projectId,
      });

      this.logger.log(`Client authenticated: ${client.id} (User: ${client.userId})`);
    } catch (error) {
      this.logger.error(`Auth error: ${error.message}`);
      client.terminate();
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: WebSocketClient,
    @MessageBody() data: any,
  ) {
    try {
      if (!client.userId || !client.projectId) {
        throw new Error('Not authenticated');
      }

      // Apply rate limiting
      try {
        await this.rateLimiter.consume(`ws:${client.userId}`);
      } catch (rateLimitError) {
        this.logger.warn(`Rate limit exceeded for user ${client.userId}`);
        await client.sendMessage({
          type: 'error',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many messages. Please slow down.',
        });
        return;
      }

      // Broadcast to all clients in the same project
      const broadcastPromises = Array.from(this.clients.values())
        .filter(c => c.projectId === client.projectId && c.id !== client.id)
        .map(recipient => 
          recipient.sendMessage({
            type: 'message',
            from: client.userId,
            projectId: client.projectId,
            data,
            timestamp: new Date().toISOString(),
          }).catch(err => {
            this.logger.error(`Failed to send message to ${recipient.id}: ${err.message}`);
            if (err.message.includes('not open')) {
              this.clients.delete(recipient);
            }
          })
        );

      await Promise.all(broadcastPromises);
      
    } catch (error) {
      this.logger.error(`Message handling error: ${error.message}`, error.stack);
      await client.sendMessage({
        type: 'error',
        code: 'MESSAGE_ERROR',
        message: error.message,
      });
    }
  }

  private checkHeartbeat() {
    this.clients.forEach((_, wsClient) => {
      const client = wsClient;
      if (!client.isAlive) {
        this.logger.log(`Terminating unresponsive client: ${client.id}`);
        return client.terminate();
      }
      client.isAlive = false;
      client.ping(() => {});
    });
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @ConnectedSocket() client: WebSocketClient,
    @MessageBody() data: { isTyping: boolean },
  ) {
    try {
      if (!client.userId || !client.projectId) {
        throw new Error('Not authenticated');
      }

      // Broadcast typing status to other users in the same project
      const broadcastPromises = Array.from(this.clients.values())
        .filter(c => c.projectId === client.projectId && c.id !== client.id)
        .map(recipient => 
          recipient.sendMessage({
            type: 'user_typing',
            userId: client.userId,
            isTyping: data.isTyping,
            timestamp: new Date().toISOString(),
          }).catch(err => {
            this.logger.error(`Failed to send typing status to ${recipient.id}: ${err.message}`);
            if (err.message.includes('not open')) {
              this.clients.delete(recipient);
            }
          })
        );

      await Promise.all(broadcastPromises);
      
    } catch (error) {
      this.logger.error(`Typing status error: ${error.message}`, error.stack);
      await client.sendMessage({
        type: 'error',
        code: 'TYPING_STATUS_ERROR',
        message: error.message,
      });
    }
  }

  async broadcastToProject(projectId: string, message: any) {
    const clients = Array.from(this.clients.values())
      .filter(client => client.projectId === projectId && client.readyState === WebSocket.OPEN);
    
    await Promise.all(
      clients.map(client => 
        client.sendMessage(message).catch(err => {
          this.logger.error(`Broadcast failed to ${client.id}: ${err.message}`);
        })
      )
    );
  }

  onModuleDestroy() {
    clearInterval(this.heartbeatInterval);
    this.clients.forEach((_, wsClient) => wsClient.terminate());
    this.clients.clear();
  }
}
