import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket as BaseSocket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { UserInfo } from './types/websocket.types';
declare module 'socket.io' {
    interface Handshake {
        user?: UserInfo;
    }
}
interface AuthenticatedSocket extends BaseSocket {
    handshake: {
        user?: {
            userId: string;
            email: string;
            name?: string;
        };
        headers: Record<string, string>;
        time: string;
        address: string;
        xdomain: boolean;
        secure: boolean;
        issued: number;
        url: string;
        query: Record<string, string>;
        auth: Record<string, any>;
    };
}
declare module 'socket.io' {
    interface Handshake {
        user?: {
            userId: string;
            email: string;
            name?: string;
        };
    }
}
export declare class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private server;
    testServer?: any;
    private readonly logger;
    private readonly missedPongs;
    private readonly MAX_MISSED_PONGS;
    private pingInterval;
    onModuleInit(): void;
    private setupPingInterval;
    private userSockets;
    private socketToUser;
    private rooms;
    private userRooms;
    handleConnection(client: AuthenticatedSocket): Promise<void>;
    handleDisconnect(client: AuthenticatedSocket): Promise<void>;
    handleJoinRoom(client: AuthenticatedSocket, data: {
        roomId: string;
    }): Promise<{
        success: boolean;
        roomId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        roomId?: undefined;
    }>;
    handleLeaveRoom(client: AuthenticatedSocket, data: {
        roomId: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
    handleOffer(client: AuthenticatedSocket, data: {
        to: string;
        offer: any;
    }): void;
    handleAnswer(client: AuthenticatedSocket, data: {
        to: string;
        answer: any;
    }): void;
    handleIceCandidate(client: AuthenticatedSocket, data: {
        to: string;
        candidate: any;
    }): void;
    private getUserRooms;
    private sendToUser;
    registerWsServer(server: Server): void;
    to(room: string): any;
    emit(event: string, ...args: any[]): any;
    private cleanupDeadSockets;
    private cleanupRoomAssociations;
    private notifyRoomOfUserLeave;
}
export {};
