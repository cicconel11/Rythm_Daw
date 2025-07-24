import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { ConfigService } from '@nestjs/config';
import { FileTransferService } from './file-transfer.service';
type FileTransferClient = WebSocket & {
    id: string;
    userId: string;
    isAlive: boolean;
};
export declare class FileTransferGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    private service;
    server: Server;
    private readonly logger;
    private clients;
    private s3Client;
    private readonly stunServers;
    constructor(configService: ConfigService, service: FileTransferService);
    handleConnection(client: FileTransferClient): Promise<void>;
    handleDisconnect(client: FileTransferClient): void;
    handleInitTransfer(client: FileTransferClient, data: {
        fileName: string;
        fileSize: number;
        mimeType: string;
        toUserId: string;
    }): Promise<{
        event: string;
        data: {
            uploadUrl: string;
            transferId: any;
            stunServers: RTCIceServer[];
            message?: undefined;
        };
    } | {
        event: string;
        data: {
            message: string;
            uploadUrl?: undefined;
            transferId?: undefined;
            stunServers?: undefined;
        };
    }>;
    handleOffer(client: FileTransferClient, data: {
        to: string;
        offer: RTCSessionDescriptionInit;
    }): Promise<void>;
    handleAnswer(client: FileTransferClient, data: {
        to: string;
        answer: RTCSessionDescriptionInit;
    }): Promise<void>;
    handleIceCandidate(client: FileTransferClient, data: {
        to: string;
        candidate: RTCIceCandidate;
    }): Promise<void>;
    emitTransferStatus(toUserId: string, data: {
        transferId: string;
        status: string;
        progress?: number;
    }): void;
}
export {};
