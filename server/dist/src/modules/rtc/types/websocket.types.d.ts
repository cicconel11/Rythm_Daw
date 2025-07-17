export declare const ClientEvents: {
    readonly JOIN_ROOM: "join_room";
    readonly LEAVE_ROOM: "leave_room";
    readonly TRACK_UPDATE: "track_update";
    readonly PRESENCE_UPDATE: "presence_update";
    readonly SIGNAL: "signal";
    readonly PING: "ping";
};
export type ClientEvent = typeof ClientEvents[keyof typeof ClientEvents];
export declare const ServerEvents: {
    readonly CONNECT: "connect";
    readonly DISCONNECT: "disconnect";
    readonly ERROR: "error";
    readonly ROOM_JOINED: "room_joined";
    readonly USER_JOINED: "user_joined";
    readonly USER_LEFT: "user_left";
    readonly TRACK_UPDATE: "track_update";
    readonly PRESENCE_UPDATE: "presence_update";
    readonly PONG: "pong";
    readonly SIGNAL: "signal";
};
export type ServerEvent = typeof ServerEvents[keyof typeof ServerEvents];
export interface UserInfo {
    userId: string;
    email: string;
    name?: string;
    avatar?: string;
    isAdmin?: boolean;
    isOnline?: boolean;
    lastSeen?: Date;
}
export interface RoomInfo {
    id: string;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    createdBy?: string;
    isPublic?: boolean;
    maxParticipants?: number;
    currentParticipants: number;
    participants: string[];
}
export interface TrackUpdate {
    roomId: string;
    trackId: string;
    type: 'audio' | 'midi' | 'automation' | 'effect';
    action: 'add' | 'update' | 'remove' | 'mute' | 'solo' | 'volume' | 'pan' | 'effect';
    data: any;
    userId?: string;
    timestamp?: number;
    version: number;
    previousVersion?: number;
}
export type PresenceStatus = 'online' | 'away' | 'offline' | 'busy';
export interface DeviceInfo {
    type?: 'desktop' | 'mobile' | 'tablet';
    os?: string;
    browser?: string;
    ip?: string;
}
export interface PresenceUpdate {
    userId: string;
    status: PresenceStatus;
    lastSeen?: Date;
    deviceInfo?: DeviceInfo;
    currentRoom?: string;
}
export interface SignalingMessage {
    to: string;
    from?: string;
    type: 'offer' | 'answer' | 'candidate' | 'reject' | 'close' | 'busy';
    payload: any;
    roomId?: string;
    metadata?: {
        sdpType?: string;
        candidate?: any;
    };
}
export interface WsErrorResponse {
    status: 'error' | 'ws_error' | 'auth_error' | 'validation_error';
    timestamp: string;
    message: string | object;
    error: string;
    code?: string;
    details?: any;
}
