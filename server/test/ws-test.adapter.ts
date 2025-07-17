import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';

export class WsTestAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Add any test-specific WebSocket server logic here
    server.on('connection', (socket: Socket) => {
      console.log('Test WebSocket client connected');
      
      // Example: Echo back any message
      socket.on('echo', (data, callback) => {
        if (typeof callback === 'function') {
          callback({ ...data, timestamp: Date.now() });
        }
      });

      socket.on('disconnect', () => {
        console.log('Test WebSocket client disconnected');
      });
    });

    return server;
  }
}
