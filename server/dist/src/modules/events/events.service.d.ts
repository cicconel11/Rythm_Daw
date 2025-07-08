import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackEventsBulkDto } from './dto/track-event.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
interface EventStats {
    total: number;
    byType: Record<string, number>;
    byDay: Array<{
        date: string;
        count: number;
    }>;
    byProject: Record<string, number>;
    byUser: Record<string, number>;
}
export declare class EventsService implements OnModuleInit {
    private readonly prisma;
    private readonly eventEmitter;
    private readonly logger;
    private readonly BATCH_SIZE;
    private readonly FLUSH_INTERVAL_MS;
    private readonly MAX_BATCH_SIZE;
    private eventQueue;
    private flushTimeout;
    private isProcessing;
    private shutdownListener;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    onModuleInit(): void;
    trackBulk(dto: TrackEventsBulkDto): Promise<void>;
    private processEvents;
    private enqueueEvents;
    private createActivityLog;
    private processQueue;
    private scheduleFlush;
    getStats(options?: {
        startDate?: Date;
        endDate?: Date;
        userId?: string;
        action?: string;
    }): Promise<EventStats>;
}
export {};
