"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIoServer = makeIoServer;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const ws_1 = require("ws");
function makeIoServer() {
    const http = (0, http_1.createServer)();
    const io = new socket_io_1.Server(http, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    const wss = new ws_1.Server({
        server: http,
        path: '/socket.io/'
    });
    http.listen();
    io.httpServer = http;
    io.wsServer = wss;
    return { io, http };
}
//# sourceMappingURL=make-io-server.js.map