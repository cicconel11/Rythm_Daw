import { Server as HttpServer } from 'http';
import { Server as IoServer, Socket as BaseSocket } from 'socket.io';

declare module 'socket.io' {
  export const createMockSocket: (id: string, server: any) => BaseSocket;
  export const createMockServer: () => any;
  
  export const Server: typeof createMockServer;
  export const Socket: typeof createMockSocket;
}
