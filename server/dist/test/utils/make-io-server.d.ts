import { Server } from 'socket.io';
export declare function makeIoServer(): {
    io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    http: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
};
