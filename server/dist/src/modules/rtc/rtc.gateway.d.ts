import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class RtcGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger;
    private _server;
    get server(): Server;
    afterInit(): Promise<void>;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleSignal(client: Socket, payload: any): Promise<void>;
}
