import { OnModuleInit } from '@nestjs/common';
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
    updateHeartbeat(userId: string, dto: HeartbeatDto): Promise<any>;
    getUserPresence(userId: string): Promise<any>;
    getProjectPresence(projectId: string): Promise<any>;
    cleanupStalePresence(): Promise<any>;
}
