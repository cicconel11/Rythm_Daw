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
import { UseGuards, OnModuleInit } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { PresenceService } from '../presence/presence.service';
import { RtcGateway } from '../rtc/rtc.gateway';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  pingInterval: 25000, // 25 seconds
  pingTimeout: 10000,  // 10 seconds
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly presenceService: PresenceService,
    private readonly rtc: RtcGateway,
  ) {}

  onModuleInit() {
    // Share the WebSocket server instance with RTC gateway
    this.rtc.registerWsServer(this.server);
  }

  async handleConnection(client: Socket) {
    const user = client.data?.user;
    if (user) {
      this.presenceService.updateUserPresence(user.userId);
      this.server.emit('userOnline', { userId: user.userId });
    }
  }

  async handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (user) {
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
