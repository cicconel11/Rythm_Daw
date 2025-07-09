import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';

/**
 * A simple WebSocket adapter for testing that extends IoAdapter
 */
export class TestWebSocketAdapter extends IoAdapter {
  private _httpServer: HttpServer;
  private _io: Server;

  constructor(app: INestApplicationContext) {
    super(app);
    this._httpServer = createServer();
    
    // Create Socket.IO server with minimal configuration
    this._io = new Server(this._httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      transports: ['polling', 'websocket'],
      allowEIO3: true
    });
  }

  // Override createIOServer instead of create
  createIOServer(port: number, options?: ServerOptions): any {
    if (!this._httpServer.listening) {
      this._httpServer.listen(port);
    }
    return this._io;
  }

  bindClientConnect(server: any, callback: (socket: Socket) => void) {
    this._io.on('connection', callback);
  }

  async close() {
    if (this._io) {
      await new Promise<void>((resolve) => this._io.close(() => resolve()));
    }
    if (this._httpServer) {
      await new Promise<void>((resolve) => this._httpServer.close(() => resolve()));
    }
  }

  getServer() {
    return this._io;
  }

  getHttpServer() {
    return this._httpServer;
  }
}

export const createTestWebSocketAdapter = (app: INestApplicationContext): TestWebSocketAdapter => {
  return new TestWebSocketAdapter(app);
};
