import { io, Socket } from 'socket.io-client';

export function mockIo(url: string, opts: any = {}): Socket {
  return io(url, { 
    transports: ['websocket'], 
    forceNew: true, 
    ...opts 
  });
}
