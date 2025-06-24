import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WsThrottlerGuard } from './guards/ws-throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    ChatGateway,
    {
      provide: APP_GUARD,
      useClass: JwtWsAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: WsThrottlerGuard,
    },
  ],
  exports: [ChatGateway],
})
export class WebSocketModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly gateway: ChatGateway) {}

  onModuleInit() {
    // WebSocket server is started automatically by NestJS
  }

  onModuleDestroy() {
    if (this.gateway.cleanup) {
      this.gateway.cleanup();
    }
  }
}
