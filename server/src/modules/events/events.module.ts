import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '../../prisma/prisma.module';
import { EventsController } from './events.controller';
// import { EventsService } from './events.service';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 100,
      verboseMemoryLeak: process.env.NODE_ENV === 'development',
    }),
  ],
  controllers: [EventsController],
  providers: [/* EventsService */],
  exports: [/* EventsService */],
})
export class EventsModule {}
