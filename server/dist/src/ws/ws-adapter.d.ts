import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
export declare class WsAdapter extends IoAdapter {
    private readonly logger;
    private httpServer;
    private wsServer;
    constructor(app: INestApplication);
    create(port: number, options?: ServerOptions): any;
    updateCors(app: INestApplication, origin?: string): void;
    close(): Promise<void>;
}
