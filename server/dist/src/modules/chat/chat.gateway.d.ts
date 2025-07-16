import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { PresenceService } from '../presence/presence.service';
import { RtcGateway } from '../rtc/rtc.gateway';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private readonly presenceService;
    private readonly rtc;
    server: Server;
    constructor(presenceService: PresenceService, rtc: RtcGateway);
    onModuleInit(): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleMessage(client: Socket, data: {
        to: string;
        content: string;
    }): {
        from: any;
        to: string;
        content: string;
        timestamp: string;
    } | undefined;
    handleTyping(client: Socket, data: {
        to: string;
        isTyping: boolean;
    }): void;
}
