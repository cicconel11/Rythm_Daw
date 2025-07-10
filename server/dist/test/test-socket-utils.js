"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeIoServer = exports.makeIoServer = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const makeIoServer = () => {
    const http = (0, http_1.createServer)();
    const io = new socket_io_1.Server(http, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        transports: ['websocket'],
        allowEIO3: true
    });
    const port = 0;
    http.listen(port);
    const address = http.address();
    const actualPort = typeof address === 'string' ? 0 : address?.port || 0;
    return {
        io,
        http,
        port: actualPort
    };
};
exports.makeIoServer = makeIoServer;
const closeIoServer = async (io, http) => {
    return new Promise((resolve, reject) => {
        try {
            io.close(() => {
                http.close(() => {
                    resolve();
                });
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.closeIoServer = closeIoServer;
//# sourceMappingURL=test-socket-utils.js.map