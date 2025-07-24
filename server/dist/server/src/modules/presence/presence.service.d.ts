import { OnModuleDestroy } from '@nestjs/common';
export declare class PresenceService implements OnModuleDestroy {
    private readonly userPresence;
    private readonly HEARTBEAT_INTERVAL;
    private cleanupInterval;
    constructor();
    onModuleDestroy(): void;
    updateUserPresence(userId: string): void;
    removeUserPresence(userId: string): void;
    isOnline(userId: string): boolean;
    private cleanupDisconnectedUsers;
    updateHeartbeat(userId: string, dto: any): Promise<void>;
    getUserPresence(userId: string): Promise<boolean>;
    getProjectPresence(projectId: string): Promise<Array<{
        userId: string;
        isOnline: boolean;
    }>>;
}
