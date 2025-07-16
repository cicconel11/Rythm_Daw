import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { PresenceService } from '../presence/presence.service';
interface WebSocketClient extends WebSocket {
    id: string;
    userId?: string;
    projectId?: string;
    isAlive: boolean;
    sendMessage: (data: any) => Promise<void>;
}
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    private readonly configService;
    private readonly presenceService;
    server: Server;
    private readonly logger;
    private readonly clients;
    private readonly rateLimiter;
    private readonly heartbeatInterval;
    private readonly MAX_QUEUE_SIZE;
    private readonly HEARTBEAT_INTERVAL;
    constructor(authService: AuthService, configService: ConfigService, presenceService: PresenceService);
    cleanup(): void;
    handleConnection(client: WebSocketClient): Promise<void>;
    handleDisconnect(client: WebSocketClient): Promise<void>;
    handleAuth(client: WebSocketClient, data: {
        token: string;
        projectId?: string;
    }): Promise<void>;
    handleMessage(client: WebSocketClient, data: any): Promise<void>;
    private checkHeartbeat;
    handleTyping(client: WebSocketClient, data: {
        isTyping: boolean;
    }): Promise<void>;
    broadcastToProject(projectId: string, message: any): Promise<void>;
    onModuleDestroy(): void;
}
export {};
