import { OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LogActivityDto } from './dto/log-activity.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
type ActivityWithUser = {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata: Prisma.JsonValue | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    userId: string;
    projectId: string | null;
    user: {
        id: string;
        name: string | null;
        email: string;
    } | null;
};
export declare class ActivityLoggerService implements OnModuleInit {
    private prisma;
    private eventEmitter;
    private readonly logger;
    private server;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    onModuleInit(): void;
    logActivity(data: LogActivityDto): Promise<ActivityWithUser>;
    getActivities(options: {
        projectId?: string;
        userId?: string | null;
        action?: string;
        entityType?: string;
        entityId?: string;
        limit?: number;
        cursor?: string;
    }): Promise<ActivityWithUser[]>;
    getActivitySummary(projectId: string, days?: number): Promise<any>;
}
export {};
