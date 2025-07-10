"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockSocket = createMockSocket;
exports.createMockServer = createMockServer;
const events_1 = require("events");
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function createMockSocket(id = generateUUID()) {
    const s = new events_1.EventEmitter();
    s.id = id;
    s.join = jest.fn();
    s.emit = jest.fn();
    s.to = jest.fn().mockReturnThis();
    s.disconnect = jest.fn();
    s.handshake = {
        auth: { token: 'valid-token' }
    };
    return s;
}
function createMockServer() {
    const server = new events_1.EventEmitter();
    server.sockets = {
        sockets: new Map(),
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
    };
    return server;
}
//# sourceMappingURL=socket-mock.js.map