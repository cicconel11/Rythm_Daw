import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WsJwtGuard } from '../src/modules/auth/guards/ws-jwt.guard';
import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

// Mock services
const mockWsJwtGuard = {
  canActivate: jest.fn().mockImplementation((context) => {
    const client = context.switchToWs().getClient();
    client.user = {
      userId: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User'
    };
    return true;
  }),
};

// Create a test WebSocket server
@WebSocketGateway()
class TestWebSocketGateway {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Test WebSocket server initialized');
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.test',
    }),
    JwtModule.register({
      secret: 'test-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    TestWebSocketGateway,
    ChatGateway,
    RtcGateway,
    PresenceService,
    {
      provide: WsJwtGuard,
      useValue: mockWsJwtGuard,
    },
  ],
  exports: [JwtModule],
})
export class WebSocketTestModule implements OnModuleInit {
  constructor(
    private readonly testGateway: TestWebSocketGateway,
    private readonly chatGateway: ChatGateway,
    private readonly rtcGateway: RtcGateway
  ) {}

  onModuleInit() {
    // Share the WebSocket server instance between gateways
    const server = this.testGateway.server;
    if (server) {
      this.chatGateway['server'] = server;
      this.rtcGateway['server'] = server;
    }
  }
}
