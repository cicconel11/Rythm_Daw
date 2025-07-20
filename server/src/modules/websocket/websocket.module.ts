import { Module, OnModuleInit, OnModuleDestroy, Logger, Global } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { WsThrottlerGuard } from '../../common/guards/ws-throttler.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    ConfigModule,
    AuthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: config.get<number>('THROTTLE_TTL', 60) * 1000, // Convert to milliseconds
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        }],
      }),
    }),
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
    // In-memory storage for WebSocket connections
    {
      provide: 'WS_CONNECTIONS',
      useValue: new Map<string, any>(),
    },
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
