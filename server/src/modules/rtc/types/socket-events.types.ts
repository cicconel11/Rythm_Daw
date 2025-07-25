// Define base socket interface
export interface BaseSocket {
  id: string;
  rooms: Set<string>;
  connected: boolean;
  emit: <T>(event: string, ...args: unknown[]) => T;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  join: (room: string) => Promise<void>;
  leave: (room: string) => Promise<void>;
  disconnect: (close?: boolean) => void;
}
import type { UserInfo, RoomInfo, TrackUpdate, PresenceUpdate, SignalingMessage, WsErrorResponse } from './websocket.types';
import { ClientEvents, ServerEvents } from './websocket.types';

// Client to Server events
export type ClientToServerEvents = {
  [ClientEvents.JOIN_ROOM]: (data: { roomId: string }) => void;
  [ClientEvents.LEAVE_ROOM]: (data: { roomId: string }) => void;
  [ClientEvents.TRACK_UPDATE]: (update: TrackUpdate) => void;
  [ClientEvents.PRESENCE_UPDATE]: (update: PresenceUpdate) => void;
  [ClientEvents.SIGNAL]: (signal: SignalingMessage) => void;
  [ClientEvents.PING]: () => void;
};

// Server to Client events
export type ServerToClientEvents = {
  [ServerEvents.CONNECT]: () => void;
  [ServerEvents.DISCONNECT]: () => void;
  [ServerEvents.ROOM_JOINED]: (data: { room: RoomInfo; participants: UserInfo[] }) => void;
  [ServerEvents.USER_JOINED]: (user: UserInfo) => void;
  [ServerEvents.USER_LEFT]: (userId: string) => void;
  [ServerEvents.TRACK_UPDATE]: (update: TrackUpdate) => void;
  [ServerEvents.PRESENCE_UPDATE]: (update: PresenceUpdate) => void;
  [ServerEvents.ERROR]: (error: WsErrorResponse) => void;
  [ServerEvents.PONG]: () => void;
  [key: string]: (...args: unknown[]) => void; // Allow any other events
};

// Inter-server events
export interface InterServerEvents {
  ping: () => void;
}

// Socket data
export interface SocketData {
  userId: string;
  user: UserInfo;
}

// Server type with our custom events
export interface Server {
  // Add any custom server methods here
  to(room: string): unknown;
  emit(event: string, ...args: unknown[]): boolean;
  in(room: string): unknown;
  sockets: {
    sockets: Map<string, BaseSocket>;
    join(room: string): Promise<void>;
    leave(room: string): Promise<void>;
    disconnect(socketId: string, close?: boolean): void;
  };
}

export interface Socket extends BaseSocket {
  id: string;
  rooms: Set<string>;
  connected: boolean;
  emit: <T>(event: string, ...args: unknown[]) => T;
  on(event: string, listener: (...args: unknown[]) => void): this;
  join(room: string): Promise<void>;
  leave(room: string): Promise<void>;
  disconnect(close?: boolean): void;
}

// Authenticated socket type with our custom properties
export type AuthenticatedSocket = Socket & {
  handshake: {
    user: UserInfo;
    auth: Record<string, unknown>;
  };
  data: SocketData;
  join: (room: string) => Promise<void>;
  leave: (room: string) => Promise<void>;
  disconnect: (close?: boolean) => void;
  to: (room: string) => AuthenticatedSocket;
  broadcast: {
    to: (room: string) => AuthenticatedSocket;
  };
};
