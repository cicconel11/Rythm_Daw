import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { RtcGateway } from './rtc.gateway';
import { RtcController } from './rtc.controller';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [RtcController],
  providers: [RtcGateway],
  exports: [RtcGateway],
})
export class RtcModule {}
