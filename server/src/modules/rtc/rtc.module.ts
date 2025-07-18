import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { RtcGateway } from './rtc.gateway';
import { RtcEnhancedGateway } from './rtc-enhanced.gateway';
import { RtcController } from './rtc.controller';
import { WsThrottlerGuard } from '../../common/guards/ws-throttler.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'defaultSecret'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RtcController],
  providers: [
    RtcGateway,
    RtcEnhancedGateway,
    {
      provide: APP_GUARD,
      useClass: WsThrottlerGuard,
    },
  ],
  exports: [RtcGateway, RtcEnhancedGateway],
})
export class RtcModule {}
