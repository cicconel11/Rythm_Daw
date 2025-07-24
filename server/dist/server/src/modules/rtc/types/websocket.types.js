"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerEvents = exports.ClientEvents = void 0;
exports.ClientEvents = {
    JOIN_ROOM: 'join_room',
    LEAVE_ROOM: 'leave_room',
    TRACK_UPDATE: 'track_update',
    PRESENCE_UPDATE: 'presence_update',
    SIGNAL: 'signal',
    PING: 'ping',
};
exports.ServerEvents = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    ROOM_JOINED: 'room_joined',
    USER_JOINED: 'user_joined',
    USER_LEFT: 'user_left',
    TRACK_UPDATE: 'track_update',
    PRESENCE_UPDATE: 'presence_update',
    PONG: 'pong',
    SIGNAL: 'signal',
};
//# sourceMappingURL=websocket.types.js.map