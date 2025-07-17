import { Socket } from 'socket.io';
import { UserInfo, RoomInfo, TrackUpdate, PresenceUpdate, SignalingMessage, WsErrorResponse, ClientEvents, ServerEvents } from './websocket.types';
export type ClientToServerEvents = {
    [ClientEvents.JOIN_ROOM]: (data: {
        roomId: string;
    }) => void;
    [ClientEvents.LEAVE_ROOM]: (data: {
        roomId: string;
    }) => void;
    [ClientEvents.TRACK_UPDATE]: (update: TrackUpdate) => void;
    [ClientEvents.PRESENCE_UPDATE]: (update: PresenceUpdate) => void;
    [ClientEvents.SIGNAL]: (signal: SignalingMessage) => void;
    [ClientEvents.PING]: () => void;
};
export type ServerToClientEvents = {
    [ServerEvents.CONNECT]: () => void;
    [ServerEvents.DISCONNECT]: () => void;
    [ServerEvents.ROOM_JOINED]: (data: {
        room: RoomInfo;
        participants: UserInfo[];
    }) => void;
    [ServerEvents.USER_JOINED]: (user: UserInfo) => void;
    [ServerEvents.USER_LEFT]: (userId: string) => void;
    [ServerEvents.TRACK_UPDATE]: (update: TrackUpdate) => void;
    [ServerEvents.PRESENCE_UPDATE]: (update: PresenceUpdate) => void;
    [ServerEvents.ERROR]: (error: WsErrorResponse) => void;
    [ServerEvents.PONG]: () => void;
    [key: string]: (...args: any[]) => void;
};
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    userId: string;
    user: UserInfo;
}
type BaseSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> & {
    emit: <T>(event: string, ...args: any[]) => T;
};
export type AuthenticatedSocket = BaseSocket & {
    handshake: {
        user: UserInfo;
    };
    data: SocketData;
    join: (room: string) => void;
    leave: (room: string) => void;
    to: (room: string) => BaseSocket;
    broadcast: {
        to: (room: string) => BaseSocket;
    };
};
export {};
