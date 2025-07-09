import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { PresenceService } from '../presence/presence.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RtcModule } from '../rtc/rtc.module';

@Module({
  imports: [RtcModule],
  providers: [ChatGateway, PresenceService, PrismaService],
  exports: [ChatGateway],
})
export class ChatModule {}
