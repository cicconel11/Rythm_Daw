import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user?: {
      sub: string;
      [key: string]: any;
    };
  }
}
