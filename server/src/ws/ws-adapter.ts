import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable, Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { ServerOptions, Server as SocketIOServer, Socket } from 'socket.io';
import { createServer, Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { Server as WsServer } from 'ws';
import { INestApplicationContext } from '@nestjs/common/interfaces/nest-application-context.interface';

// Global error handler for uncaught exceptions in WebSocket handlers
process.on('uncaughtException', (error) => {
  console.error('WebSocket uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('WebSocket unhandled rejection at:', promise, 'reason:', reason);
});

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
      this.logger.log('Creating HTTP server for WebSockets');
      this.httpServer = createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('RHYTHM WebSocket Server');
      });

      // Add error handling
      this.httpServer.on('error', (error) => {
        this.logger.error('HTTP server error:', error);
      });

      this.httpServer.on('listening', () => {
        const address = this.httpServer?.address();
        this.logger.log(`HTTP server listening on ${typeof address === 'string' ? address : address?.port}`);
      });
    }
  }
  
  public createIOServer(port: number, options?: ServerOptions): unknown {
    try {
      this.logger.log(`Creating Socket.IO server on port ${port}`);
      
      if (!this.httpServer) {
        throw new Error('HTTP server not initialized');
      }
      
      const io = new SocketIOServer(this.httpServer, {
        ...options,
        cors: {
          origin: process.env.CORS_ORIGINS?.split(',') || '*',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        maxHttpBufferSize: 1e8, // 100MB
      });

      io.on('connection', (socket: Socket) => {
        this.logger.log(`Client connected: ${socket.id}`);
        
        socket.on('disconnect', (reason) => {
          this.logger.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
        });

        socket.on('error', (error) => {
          this.logger.error(`Socket error (${socket.id}):`, error);
        });
      });

      io.engine.on('connection_error', (error: unknown) => {
        this.logger.error('Socket.IO connection error:', error);
      });
      
      return io;
    } catch (error) {
      this.logger.error('Failed to create Socket.IO server:', error);
      throw error;
    }
  }

  create(port: number, options?: ServerOptions): unknown {
    try {
      this.logger.log(`Creating WebSocket server on port ${port}`);
      
      // Ensure HTTP server is created
      this.createHttpServer();

      if (!this.httpServer) {
        throw new Error('Failed to create HTTP server');
      }

      // If the server is already listening, close it first
      if (this.httpServer.listening) {
        this.logger.log('HTTP server is already running, closing it first...');
        this.close();
      }

      // Bind to the specified port
      return new Promise((resolve, reject) => {
        if (!this.httpServer) {
          return reject(new Error('HTTP server not initialized'));
        }

        // Handle server errors during binding
        const errorHandler = (error: Error) => {
          this.logger.error(`Failed to bind to port ${port}:`, error);
          reject(error);
        };

        this.httpServer.once('error', errorHandler);

        // Start listening
        this.httpServer.listen(port, () => {
          // Remove the error handler after successful binding
          this.httpServer?.removeListener('error', errorHandler);
          this.logger.log(`WebSocket server bound to port ${port}`);

          try {
            // Create and return the Socket.IO server
            const io = this.createIOServer(port, options);
            
            // Store the IO instance for cleanup
            (this as unknown as { io?: unknown }).io = io;
            
            // Handle process exit to clean up resources
            process.on('SIGTERM', () => this.close());
            process.on('SIGINT', () => this.close());
            
            resolve(io);
          } catch (error) {
            this.logger.error('Failed to create Socket.IO server:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      this.logger.error('Failed to create WebSocket server:', error);
      throw error;
    }
  }

  // Allow e2e tests to swap CORS quickly
  updateCors(app: INestApplication, origin = '*') {
    const io = (app.getHttpServer() as unknown as { io?: unknown }).io as unknown;
    if (io?.engine) {
      io.opts.cors = { 
        origin, 
        methods: ['GET', 'POST'] 
      };
    }
  }

  // Cleanup method to close servers
  async close() {
    try {
      this.logger.log('Closing WebSocket server...');
      
      // Close Socket.IO server if it exists
      if ((this as unknown as { io?: { close: (cb: () => void) => void } }).io) {
        await new Promise<void>((resolve) => {
          (this as unknown as { io?: { close: (cb: () => void) => void } }).io.close(() => {
            this.logger.log('Socket.IO server closed');
            resolve();
          });
        });
      }
      
      // Close WebSocket server if it exists
      if (this.wsServer) {
        this.wsServer.close(() => {
          this.logger.log('WebSocket server closed');
        });
        this.wsServer = null;
      }
      
      // Close HTTP server if it exists
      if (this.httpServer) {
        await new Promise<void>((resolve) => {
          this.httpServer?.close((err) => {
            if (err) {
              this.logger.error('Error closing HTTP server:', err);
            } else {
              this.logger.log('HTTP server closed');
            }
            resolve();
          });
        });
        this.httpServer = null;
      }
      
      this.logger.log('WebSocket server shutdown complete');
    } catch (error) {
      this.logger.error('Error during WebSocket server shutdown:', error);
      throw error;
    }
  }
}
