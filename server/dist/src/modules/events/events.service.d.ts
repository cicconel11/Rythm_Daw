import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackEventsBulkDto } from './dto/track-event.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class EventsService implements OnModuleInit {
    private prisma;
    private eventEmitter;
    private readonly logger;
    private readonly MAX_BATCH_SIZE;
    private readonly BATCH_FLUSH_INTERVAL;
    private readonly MAX_QUEUE_SIZE;
    private queue;
    private flushTimer;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    onModuleInit(): void;
    trackBulk(dto: TrackEventsBulkDto): Promise<void>;
    private enqueueEvents;
    private processEvents;
    private flushQueue;
    private scheduleFlush;
    getStats(options: {
        startDate: Date;
        endDate: Date;
        eventType?: string;
        projectId?: string;
    }): Promise<{
        total: any;
        byType: any;
    }>;
}
