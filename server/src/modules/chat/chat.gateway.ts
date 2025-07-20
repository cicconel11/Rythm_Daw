import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, OnModuleInit, Logger } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { PresenceService } from '../presence/presence.service';
import { RtcGateway } from '../rtc/rtc.gateway';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  pingInterval: 30000,  // 30 seconds
  pingTimeout: 10000,   // 10 seconds
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;
  
  private readonly logger = new Logger(ChatGateway.name);
  private readonly missedPongs = new Map<string, number>();
  private readonly MAX_MISSED_PONGS = 2;
  private pingInterval: NodeJS.Timeout;

  constructor(
    private readonly presenceService: PresenceService,
    private readonly rtc: RtcGateway,
  ) {}

  onModuleInit() {
    // Share the WebSocket server instance with RTC gateway
    this.rtc.registerWsServer(this.server);
    
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
      this.server.sockets.sockets.forEach((socket) => {
        // Only send ping to authenticated sockets
        if (socket.connected && socket.data?.user?.userId) {
          socket.emit('ping', { timestamp: now });
          
          // Initialize missed pongs counter if needed
          if (!this.missedPongs.has(socket.id)) {
            this.missedPongs.set(socket.id, 0);
          }
        }
      });
    }, 30000); // 30 seconds
  }

  private async sendToClient(client: Socket, event: string, data: unknown): Promise<void> {
    client.emit(event, data);
  }

  async handleConnection(client: Socket & { data: any }) {
    const user = client.data?.user;
    if (user) {
      this.presenceService.updateUserPresence(user.userId);
      this.server.emit('userOnline', { userId: user.userId });
      
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
    }
  }

  async handleDisconnect(client: Socket & { data: any }) {
    const user = client.data?.user;
    if (user) {
      // Clean up ping/pong tracking
      this.missedPongs.delete(client.id);
      
      // Don't immediately remove, let the presence service handle it
      this.server.emit('userOffline', { userId: user.userId });
    }
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; content: string; },
  ) {
    const user = client.data?.user;
    if (!user) return;

    const message = {
      from: user.userId,
      to: data.to,
      content: data.content,
      timestamp: new Date().toISOString(),
    };

    // Emit to specific user or room
    if (data.to.startsWith('room:')) {
      // Room message
      this.server.to(data.to).emit('message', message);
    } else {
      // Private message
      this.server.to(data.to).emit('message', message);
    }

    // Send back to sender
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; isTyping: boolean },
  ) {
    const user = client.data?.user;
    if (!user) return;

    this.server.to(data.to).emit('typing', {
      from: user.userId,
      isTyping: data.isTyping,
    });
  }
}
