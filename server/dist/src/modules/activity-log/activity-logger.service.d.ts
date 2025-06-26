import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LogActivityDto } from './dto/log-activity.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ActivityLoggerService implements OnModuleInit {
    private prisma;
    private eventEmitter;
    private readonly logger;
    private server;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    onModuleInit(): void;
    logActivity(data: LogActivityDto): Promise<any>;
    getActivities(options: {
        projectId?: string;
        userId?: string;
        event?: string;
        limit?: number;
        cursor?: string;
    }): Promise<any>;
    getActivitySummary(projectId: string, days?: number): Promise<any>;
}
