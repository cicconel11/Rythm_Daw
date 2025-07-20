import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket 
} from '@nestjs/websockets';
import { 
  Logger, 
  UseFilters, 
  UseGuards, 
  UseInterceptors, 
  Inject, 
  forwardRef, 
  OnModuleInit, 
  OnModuleDestroy 
} from '@nestjs/common';
import { Server as IoServer, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { AuthService } from '../auth/auth.service';
import { WsThrottlerGuard } from './guards/ws-throttler.guard';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../presence/presence.service';
import { MessageQueue } from './message-queue';

// Import types first to avoid circular dependencies
import { 
  ClientEvents, 
  ServerEvents, 
  InterServerEvents, 
  SocketData 
} from './types/websocket.types';

// Extended socket type with our custom properties
interface CustomSocket extends Socket {
  userId?: string;
  username?: string;
  isAlive: boolean;
  lastPing: number;
  handshake: {
    query: {
      userId?: string;
      username?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

interface ConnectedClient {
  socket: CustomSocket;
  userId: string;
  username: string;
  isAlive: boolean;
  lastPing: number;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'chat',
  pingInterval: 30000,
  pingTimeout: 10000,
})
@UseGuards(JwtWsAuthGuard, WsThrottlerGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  private io: IoServer;
  
  // Alias for backward compatibility
  get server(): IoServer {
    return this.io;
  }
  
  private readonly logger = new Logger(ChatGateway.name);
  private readonly rateLimiter: RateLimiterMemory;
  private readonly clientQueues = new Map<string, MessageQueue>();
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly heartbeatIntervals = new Map<string, NodeJS.Timeout>();
  private readonly MAX_QUEUE_SIZE = 100; // Max messages in queue before backpressure
  private readonly connectedClients = new Map<string, ConnectedClient>();
  private readonly messageQueues = new Map<string, any>();
  private readonly rooms = new Map<string, Set<string>>();

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly presenceService: PresenceService,
  ) {
    this.rateLimiter = new RateLimiterMemory({
      points: 100, // 100 messages
      duration: 60, // per 60 seconds
    });
    
    this.logger = new Logger(ChatGateway.name);
    this.logger.log('ChatGateway initialized');
  }
  
  afterInit(server: IoServer) {
    this.io = server;
  }

  onModuleInit() {
    this.logger.log('ChatGateway initialized');
  }

  async handleConnection(client: CustomSocket) {
    try {
      // Initialize client properties
      client.isAlive = true;
      client.lastPing = Date.now();
      
      const userId = client.handshake?.query?.userId as string | undefined;
      const username = (client.handshake?.query?.username as string | undefined) || 'anonymous';
      
      if (!userId) {
        this.logger.warn('Connection rejected: Missing userId');
        client.disconnect(true);
        return;
      }
      
      // Store connected client with required properties
      const connectedClient: ConnectedClient = {
        socket: client,
        userId,
        username,
        isAlive: true,
        lastPing: Date.now()
      };
      
      this.connectedClients.set(client.id, connectedClient);
      this.logger.log(`Client connected: ${client.id} (User: ${username})`);
      
      // Set up ping-pong for connection health
      const pingInterval = setInterval(() => {
        const clientData = this.connectedClients.get(client.id);
        if (!clientData?.isAlive) {
          client.disconnect(true);
          return clearInterval(pingInterval);
        }
        
        clientData.isAlive = false;
        client.emit('ping');
      }, this.HEARTBEAT_INTERVAL);
      
      // Clean up interval on disconnect
      client.once('disconnect', () => {
        clearInterval(pingInterval);
        this.connectedClients.delete(client.id);
      });
      
      client.on('pong', () => {
        const clientData = this.connectedClients.get(client.id);
        if (clientData) {
          clientData.isAlive = true;
          clientData.lastPing = Date.now();
        }
      });
      
      // Initialize message queue for this client
      if (!this.messageQueues.has(client.id)) {
        const messageQueue = new MessageQueue(client);
        this.messageQueues.set(client.id, messageQueue);
        this.clientQueues.set(client.id, messageQueue);
      }
      
      // Set up heartbeat
      this.setupHeartbeat(client);
      
      // Update presence
      this.presenceService.updateUserPresence(userId);
      
      // Notify others about the new connection using the server instance
      this.server.emit('userConnected', {
        userId,
        username,
        timestamp: new Date().toISOString(),
      });
      
      // Send the list of connected users to the new client
      const connectedUsers = Array.from(this.connectedClients.values())
        .filter(c => c.userId)
        .map(({ userId, username }) => ({ userId, username }));
      
      client.emit('userList', connectedUsers);
      client.on('pong', () => {
        client.isAlive = true;
        client.lastPing = Date.now();
      });
      
      // Update presence if userId is available from handshake
      const presenceUserId = client.handshake.query.userId as string;
      if (presenceUserId) {
        this.presenceService.updateUserPresence(presenceUserId);
      }
      
    } catch (error) {
      this.logger.error('Error in handleConnection:', error);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: CustomSocket) {
    try {
      const disconnectedClient = this.connectedClients.get(client.id);
      
      if (!disconnectedClient) {
        this.logger.warn(`No client found for socket ID: ${client.id}`);
        return;
      }
      
      const { userId, username } = disconnectedClient;
      const logPrefix = `[${client.id}] [User: ${username || 'unknown'}]`;
      
      this.logger.log(`${logPrefix} Disconnecting...`);
      
      // Notify others about the disconnection
      this.server.emit('userDisconnected', {
        userId,
        username,
        timestamp: new Date().toISOString(),
      });
      
      // Clean up resources
      this.cleanupClientResources(client.id);
      
      // Remove presence on disconnect if we have a valid userId
      if (userId) {
        this.presenceService.removeUserPresence(userId);
      }
      
      this.logger.log(`${logPrefix} Disconnected successfully`);
    } catch (error) {
      this.logger.error(`Error in handleDisconnect for client ${client.id}:`, error);
    }
  }
  
  /**
   * Cleans up all resources associated with a client
   * @param clientId - The ID of the client to clean up
   */
  private cleanupClientResources(clientId: string): void {
    // Remove from connected clients
    this.connectedClients.delete(clientId);
    
    // Clean up message queue
    const queue = this.clientQueues.get(clientId);
    if (queue) {
      queue.stop();
      this.clientQueues.delete(clientId);
    }
    
    // Clean up heartbeat
    this.clearHeartbeat(clientId);
    
    // Clean up message queues
    this.messageQueues.delete(clientId);
    
    // Remove from all rooms
    this.rooms.forEach((sockets, roomId) => {
      if (sockets.has(clientId)) {
        sockets.delete(clientId);
        if (sockets.size === 0) {
          this.rooms.delete(roomId);
        }
      }
    });
  }

  async onModuleDestroy() {
    this.logger.log('Cleaning up WebSocket resources...');
    
    // Clear all heartbeat intervals
    this.heartbeatIntervals.forEach((interval, clientId) => {
      clearInterval(interval);
      this.heartbeatIntervals.delete(clientId);
    });
    
    // Disconnect all clients
    this.connectedClients.forEach(client => {
      try {
        if (client?.socket) {
          client.socket.disconnect(true);
        }
      } catch (err) {
        this.logger.error(`Error disconnecting client: ${err}`);
      }
    });
    
    // Clear all collections
    this.connectedClients.clear();
    this.messageQueues.clear();
    this.rooms.clear();
    this.clientQueues.clear();
    
    this.logger.log('WebSocket resources cleaned up');
  }

  private async sendToClient(client: CustomSocket, event: string, data: unknown): Promise<void> {
    try {
      const queue = this.clientQueues.get(client.id);
      if (queue) {
        await queue.enqueue(event, data);
      } else {
        client.emit(event, data);
      }
    } catch (error) {
      this.logger.error(`Error sending to client ${client.id}:`, error);
    }
  }

  @SubscribeMessage('authenticate')
  async handleAuth(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { token: string; projectId?: string },
  ) {
    try {
      const user = await this.authService.verifyToken(data.token);
      if (!user) {
        throw new Error('Invalid token');
      }

      // Store user info on the socket
      (client as any).user = user;

      // Join project room if projectId is provided
      if (data.projectId) {
        await client.join(`project:${data.projectId}`);
        (client as any).projectId = data.projectId;
      }

      return { success: true, user: { id: user.id, username: user.username } };
    } catch (error) {
      this.logger.error('Authentication error:', error);
      throw new Error('Authentication failed');
    }
  }

  private clearHeartbeat(clientId: string): void {
    const interval = this.heartbeatIntervals.get(clientId);
    if (interval) {
      clearInterval(interval);
      this.heartbeatIntervals.delete(clientId);
      this.logger.debug(`Cleared heartbeat for client ${clientId}`);
    }
  }

  private setupHeartbeat(client: CustomSocket): void {
    const clientId = client.id;
    // Clear any existing heartbeat for this client
    this.clearHeartbeat(clientId);
    
    const interval = setInterval(() => {
      const clientData = this.connectedClients.get(clientId);
      if (!clientData?.isAlive) {
        this.logger.warn(`Client ${clientId} heartbeat timeout`);
        return client.disconnect(true);
      }
      
      clientData.isAlive = false;
      client.emit('ping');
    }, this.HEARTBEAT_INTERVAL);
    
    this.heartbeatIntervals.set(clientId, interval);
    
    const onPong = () => {
      const clientData = this.connectedClients.get(clientId);
      if (clientData) {
        clientData.isAlive = true;
        clientData.lastPing = Date.now();
      }
    };
    
    const onDisconnect = () => {
      this.clearHeartbeat(clientId);
      client.off('pong', onPong);
      client.off('disconnect', onDisconnect);
    };
    
    client.on('pong', onPong);
    client.once('disconnect', onDisconnect);
  }

  private async handleRateLimit(client: CustomSocket): Promise<boolean> {
    try {
      await this.rateLimiter.consume(client.id);
      return true;
    } catch (error) {
      this.logger.warn(`Rate limit exceeded for client ${client.id}`);
      client.emit('error', { message: 'Rate limit exceeded. Please try again later.' });
      client.disconnect(true);
      return false;
    }
  }

  private async broadcastToRoom(roomId: string, event: string, data: any, excludeClientId?: string): Promise<void> {
    const room = this.rooms.get(roomId);
    if (!room) {
      this.logger.warn(`Attempted to broadcast to non-existent room: ${roomId}`);
      return;
    }

    const sockets = Array.from(room)
      .map(socketId => this.connectedClients.get(socketId)?.socket)
      .filter((socket): socket is CustomSocket => !!socket);

    await Promise.all(
      sockets.map(socket => {
        if (socket.id !== excludeClientId) {
          return this.sendToClient(socket, event, data);
        }
        return Promise.resolve();
      })
    );
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { content?: string; roomId?: string },
  ) {
    const userId = client.handshake?.query?.userId as string | undefined;
    const username = (client.handshake?.query?.username as string | undefined) || 'Anonymous';
    const logPrefix = `[${client.id}] [User: ${username}]`;
  
    if (!userId) {
      this.logger.warn(`${logPrefix} Unauthenticated message attempt`);
      client.emit('error', { 
        code: 'UNAUTHENTICATED',
        message: 'Authentication required' 
      });
      return;
    }
    
    if (!data?.content?.trim()) {
      this.logger.warn(`${logPrefix} Empty message content`);
      client.emit('error', {
        code: 'INVALID_INPUT',
        message: 'Message content cannot be empty'
      });
      return;
    }
  
    try {
      // Apply rate limiting
      const canProceed = await this.handleRateLimit(client);
      if (!canProceed) {
        this.logger.warn(`${logPrefix} Rate limit exceeded`);
        return;
      }
  
      const timestamp = new Date().toISOString();
      const message = {
        id: uuidv4(),
        content: data.content.trim(),
        userId,
        username,
        timestamp,
        roomId: data.roomId
      };
      
      this.logger.log(`${logPrefix} Sending message to ${data.roomId ? `room ${data.roomId}` : 'all clients'}`);
  
      // Broadcast message to room or all clients
      if (data.roomId) {
        await this.broadcastToRoom(data.roomId, 'message', message, client.id);
      } else {
        this.server.emit('message', message);
      }
      
      // Acknowledge the message was sent
      client.emit('messageAck', { id: message.id, timestamp });
    } catch (error) {
      const errorId = uuidv4();
      this.logger.error(`${logPrefix} Error handling message (${errorId}):`, error);
      
      client.emit('error', { 
        id: errorId,
        code: 'MESSAGE_DELIVERY_FAILED',
        message: 'Failed to send message',
        timestamp: new Date().toISOString()
      });
    }
  }

  private getUserClients(userId: string): CustomSocket[] {
    const clients: CustomSocket[] = [];
    
    if (this.server?.sockets?.sockets) {
      this.server.sockets.sockets.forEach((socket: CustomSocket) => {
        const socketUserId = (socket.handshake.query.userId as string) || '';
        if (socketUserId === userId) {
          clients.push(socket);
        }
      });
    }
    
    return clients;
  }

  async broadcastToProject(projectId: string, message: unknown): Promise<void> {
    const clients = this.getUserClients(projectId);
    
    await Promise.all(
      clients.map(client => {
        try {
          return new Promise<void>((resolve) => {
            client.emit('broadcast', message, () => resolve());
          }).catch((err: Error) => {
            this.logger.error(`Broadcast failed: ${err.message}`);
          });
        } catch (err) {
          this.logger.error('Error in broadcastToProject:', err);
          return Promise.resolve();
        }
      })
    );
  }

  private findRecipientQueue(userId: string): MessageQueue | undefined {
    for (const [clientId, queue] of this.clientQueues.entries()) {
      const client = this.connectedClients.get(clientId);
      if (client?.userId === userId) {
        return queue;
      }
    }
    return undefined;
  }
}
