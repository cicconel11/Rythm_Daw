import 'socket.io';

declare module 'socket.io' {
  interface Handshake {
    user?: { userId: string; email: string; name?: string };
  }
}
