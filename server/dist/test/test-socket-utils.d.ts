import { Server as IOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
export declare const makeIoServer: () => {
    io: IOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
    http: HttpServer<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    port: number;
};
export declare const closeIoServer: (io: any, http: HttpServer) => Promise<void>;
