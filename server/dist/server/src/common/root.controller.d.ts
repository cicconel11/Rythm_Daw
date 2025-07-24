import { Redis } from 'ioredis';
export declare class RootController {
    private readonly redis;
    constructor(redis: Redis);
    root(): string;
    healthz(): Promise<{
        status: string;
        db: string;
        redis: string;
        uptime: number;
    }>;
}
