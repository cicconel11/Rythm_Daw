import { Module } from '@nestjs/common';
import { ActivityLoggerService } from './activity-logger.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [ActivityLoggerService],
  exports: [ActivityLoggerService],
})
export class ActivityLogModule {}
