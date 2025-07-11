import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { Server as HttpServer } from 'http';
export declare class WsAdapter extends IoAdapter {
    private readonly logger;
    protected httpServer: HttpServer | null;
    private wsServer;
    private app;
    constructor(app: INestApplication);
    private createHttpServer;
    createIOServer(port: number, options?: ServerOptions): any;
    create(port: number, options?: ServerOptions): any;
    updateCors(app: INestApplication, origin?: string): void;
    close(): Promise<void>;
}
