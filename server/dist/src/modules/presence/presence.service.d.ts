import { OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class PresenceService implements OnModuleInit {
    private prisma;
    private eventEmitter;
    private readonly logger;
    private readonly HEARTBEAT_TIMEOUT_MS;
    private readonly STALE_PRESENCE_MS;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    onModuleInit(): void;
    updateHeartbeat(userId: string, dto: HeartbeatDto): Promise<{
        userId: string;
        projectId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        expiresAt: Date;
        lastSeen: Date;
    }>;
    getUserPresence(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    } & {
        userId: string;
        projectId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        expiresAt: Date;
        lastSeen: Date;
    }) | null>;
    getProjectPresence(projectId: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string | null;
        };
    } & {
        userId: string;
        projectId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        expiresAt: Date;
        lastSeen: Date;
    })[]>;
    cleanupStalePresence(): Promise<Prisma.BatchPayload>;
    removePresence(userId: string, projectId?: string): Promise<void>;
}
