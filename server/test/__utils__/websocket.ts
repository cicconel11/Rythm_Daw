import { io, Socket } from 'socket.io-client';
import { AddressInfo } from 'net';
import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as http from 'http';

export function createWsTestApp(app: INestApplication): Promise<{ httpServer: http.Server; port: number }> {
  // Create HTTP server
  const httpServer = http.createServer();
  
  // Wrap the server with Socket.IO
  const ioAdapter = new IoAdapter(httpServer);
  app.useWebSocketAdapter(ioAdapter);
  
  return new Promise((resolve) => {
    httpServer.listen(0, () => {
      const port = (httpServer.address() as AddressInfo).port;
      resolve({ httpServer, port });
    });
  });
}

export function createSocketClient(port: number, options: unknown = {}): Socket {
  return io(`http://localhost:${port}`, {
    transports: ['websocket'],
    forceNew: true,
    ...options
  });
}

export async function waitForEvent(socket: Socket, event: string, timeout = 1000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event: ${event}`));
    }, timeout);

    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}
