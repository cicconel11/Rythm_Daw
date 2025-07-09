import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RtcOfferDto } from './dto/rtc-offer.dto';
import { RtcAnswerDto } from './dto/rtc-answer.dto';
import { RtcGateway } from './rtc.gateway';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rtc')
@UseGuards(JwtAuthGuard)
export class RtcController {
  constructor(private readonly rtcGateway: RtcGateway) {}

  @Post('offer')
  async handleOffer(@Body() dto: RtcOfferDto) {
    const result = this.rtcGateway.emitToUser(dto.to, 'rtcOffer', dto);
    return { success: result };
  }

  @Post('answer')
  async handleAnswer(@Body() dto: RtcAnswerDto) {
    const result = this.rtcGateway.emitToUser(dto.to, 'rtcAnswer', dto);
    return { success: result };
  }
}
