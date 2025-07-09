import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PresenceService } from '../presence/presence.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    ChatGateway,
    PresenceService,
    WsJwtGuard,
  ],
  exports: [ChatGateway, PresenceService],
})
export class ChatModule {}
