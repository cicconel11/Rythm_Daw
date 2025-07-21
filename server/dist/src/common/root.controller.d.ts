import { PrismaService } from '../prisma/prisma.service';
import { Redis } from 'ioredis';
export declare class RootController {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: Redis);
    root(): string;
    healthz(): Promise<{
        status: string;
        db: string;
        redis: string;
        uptime: number;
    }>;
}
