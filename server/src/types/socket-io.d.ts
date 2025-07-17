import { Handshake as BaseHandshake } from 'socket.io/dist/socket';
import { UserInfo } from '../modules/rtc/types/websocket.types';

declare module 'socket.io' {
  interface Handshake extends BaseHandshake {
    user: UserInfo;
  }
}

// Extend the Socket type to include our custom properties
declare module 'socket.io' {
  interface Socket {
    handshake: Handshake & {
      user: UserInfo;
    };
  }
}
