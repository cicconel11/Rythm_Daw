import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket as BaseSocket } from 'socket.io';
import { Logger } from '@nestjs/common';
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
export declare class RtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private server;
    private readonly logger;
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
    getUserSockets(): Map<string, Set<string>>;
    getSocketToUser(): Map<string, string>;
    getLogger(): Logger;
    registerWsServer(server: Server): void;
    protected emitToUser(userId: string, event: string, payload: any): boolean;
}
export {};
