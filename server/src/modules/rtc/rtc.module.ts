import { Module } from '@nestjs/common';
import { RtcGateway } from './rtc.gateway';
import { RtcController } from './rtc.controller';
import { WsThrottlerGuard } from '../../common/guards/ws-throttler.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    RtcGateway,
    {
      provide: APP_GUARD,
      useClass: WsThrottlerGuard,
    },
  ],
  controllers: [RtcController],
  exports: [RtcGateway],
})
export class RtcModule {}
