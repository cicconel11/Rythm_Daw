import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ServerOptions, Server as SocketIOServer, Socket } from 'socket.io';
import { createServer, Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { Server as WsServer } from 'ws';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';

@Injectable()
export class WsAdapter extends IoAdapter {
  private readonly logger = new Logger(WsAdapter.name);
  protected httpServer: HttpServer | null = null;
  private wsServer: WsServer | null = null;
  private app: INestApplicationContext;

  constructor(app: INestApplication) {
    super(app);
    this.app = app;
    this.createHttpServer();
  }

  private createHttpServer() {
    if (!this.httpServer) {
      this.httpServer = createServer();
    }
  }
  
  public createIOServer(port: number, options?: ServerOptions): any {
    if (!this.httpServer) {
      throw new Error('HTTP server not initialized');
    }
    
    const io = new SocketIOServer(this.httpServer, {
      ...options,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    return io;
  }

  create(port: number, options?: ServerOptions): any {
    // Ensure HTTP server is created
    this.createHttpServer();

    if (!this.httpServer) {
      throw new Error('Failed to create HTTP server');
    }

    // Create Socket.IO server using our helper method
    const io = this.createIOServer(port, options);
    
    // Create WebSocket server
    this.wsServer = new WsServer({
      server: this.httpServer,
      path: options?.path || '/socket.io/',
    });
    
    // Start listening if a port is provided
    if (port && typeof port === 'number' && this.httpServer) {
      this.httpServer.listen(port, () => {
        this.logger.log(`WebSocket server listening on port ${port}`);
      });
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
        this.wsServer?.close(() => {
          this.logger.log('WebSocket server closed');
          resolve();
        });
      });
      this.wsServer = null;
    }
    
    if (this.httpServer) {
      await new Promise<void>((resolve) => {
        this.httpServer?.close(() => {
          this.logger.log('HTTP server closed');
          resolve();
        });
      });
      this.httpServer = null;
    }
  }
}
