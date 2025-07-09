import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ServerOptions, Server as SocketIOServer } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { Server as WsServer } from 'ws';

@Injectable()
export class WsAdapter extends IoAdapter {
  private readonly logger = new Logger(WsAdapter.name);
  private httpServer: HttpServer;
  private wsServer: WsServer;

  constructor(app: INestApplication) {
    super(app);
  }

  create(port: number, options?: ServerOptions): any {
    // Create HTTP server if not already created
    if (!this.httpServer) {
      this.httpServer = createServer();
    }

    // Create Socket.IO server
    const io = new SocketIOServer(this.httpServer, {
      ...options,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    // Create WebSocket server
    this.wsServer = new WsServer({
      server: this.httpServer,
      path: '/socket.io/',
    });
    
    // Start listening if a port is provided
    if (port && typeof port === 'number') {
      this.httpServer.listen(port);
      this.logger.log(`WebSocket server listening on port ${port}`);
    }
    
    // Store references for cleanup
    (io as any).httpServer = this.httpServer;
    (io as any).wsServer = this.wsServer;
    
    return io;
  }

  // Allow e2e tests to swap CORS quickly
  updateCors(app: INestApplication, origin = '*') {
    const io = (app.getHttpServer() as any).io as any;
    if (io?.engine) {
      io.opts.cors = { 
        origin, 
        methods: ['GET', 'POST'] 
      };
    }
  }

  // Cleanup method to close servers
  async close() {
    if (this.wsServer) {
      await new Promise<void>((resolve) => {
        this.wsServer.close(() => {
          this.logger.log('WebSocket server closed');
          resolve();
        });
      });
    }
    
    if (this.httpServer) {
      await new Promise<void>((resolve) => {
        this.httpServer.close(() => {
          this.logger.log('HTTP server closed');
          resolve();
        });
      });
    }
  }
}
