import { Module } from '@nestjs/common';
import { RtcGateway } from './rtc.gateway';
import { RtcController } from './rtc.controller';

@Module({
  controllers: [RtcController],
  providers: [RtcGateway],
  exports: [RtcGateway],
})
export class RtcModule {}
