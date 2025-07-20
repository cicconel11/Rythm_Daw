import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../presence/presence.service';
declare module 'socket.io' {
    interface Socket {
        userId?: string;
        username?: string;
        isAlive?: boolean;
        lastPing?: number;
    }
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
    private readonly authService;
    private readonly configService;
    private readonly presenceService;
    server: SocketIOServer;
    private readonly logger;
    private readonly rateLimiter;
    private readonly clientQueues;
    private readonly HEARTBEAT_INTERVAL;
    private readonly heartbeatIntervals;
    private readonly MAX_QUEUE_SIZE;
    private readonly connectedClients;
    private readonly messageQueues;
    private readonly rooms;
    constructor(authService: AuthService, configService: ConfigService, presenceService: PresenceService);
    onModuleInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private sendToClient;
    handleAuth(client: any, data: {
        token: string;
        projectId?: string;
    }): Promise<{
        success: boolean;
        user: {
            id: any;
            username: any;
        };
    }>;
    private clearHeartbeat;
    private setupHeartbeat;
    private handleRateLimit;
    handleMessage(client: any, data: {
        content: string;
        roomId?: string;
    }): Promise<void>;
    private broadcastToRoom;
    private getUserClients;
    broadcastToProject(projectId: string, message: unknown): Promise<void>;
    private findRecipientQueue;
}
