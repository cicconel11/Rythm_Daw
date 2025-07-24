import { Socket } from 'socket.io';
export interface WebSocketClient extends Socket {
    userId: string;
    projectId?: string;
    isAlive?: boolean;
    lastPing?: number;
}
export interface ClientEvents {
    'message': (data: {
        to: string;
        content: string;
        metadata?: Record<string, unknown>;
    }) => void;
    'typing': (isTyping: boolean) => void;
    'join': (room: string) => void;
    'leave': (room: string) => void;
    'pong': () => void;
}
export interface ServerEvents {
    'message': (data: {
        from: string;
        to: string;
        content: string;
        timestamp: string;
        metadata?: Record<string, unknown>;
    }) => void;
    'userTyping': (userId: string, isTyping: boolean) => void;
    'userOnline': (userId: string) => void;
    'userOffline': (userId: string) => void;
    'error': (error: {
        code: string;
        message: string;
        [key: string]: unknown;
    }) => void;
    'ping': () => void;
}
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    userId: string;
    username?: string;
}
