"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = exports.MockWebSocket = void 0;
const mockServer = {
    on: jest.fn(),
    close: jest.fn((cb) => cb()),
    address: jest.fn(() => ({ port: 8080 })),
};
const events_1 = require("events");
class MockWebSocket extends events_1.EventEmitter {
    constructor(id = Math.random().toString(36).substring(2, 15)) {
        super();
        this.CONNECTING = 0;
        this.OPEN = 1;
        this.CLOSING = 2;
        this.CLOSED = 3;
        this.binaryType = 'arraybuffer';
        this.bufferedAmount = 0;
        this.extensions = '';
        this.protocol = '';
        this.url = 'ws://localhost:8080';
        this.onopen = null;
        this.onmessage = null;
        this.onclose = null;
        this.onerror = null;
        this.readyState = this.OPEN;
        this.send = jest.fn((data) => {
        });
        this.close = jest.fn((code, reason) => {
            this.readyState = this.CLOSED;
            if (this.onclose) {
                this.onclose(new CloseEvent('close', { code, reason }));
            }
        });
        this.terminate = jest.fn(() => {
            this.readyState = this.CLOSED;
            if (this.onclose) {
                this.onclose(new CloseEvent('close', { code: 1006, reason: 'Connection terminated' }));
            }
        });
        this.pause = jest.fn();
        this.resume = jest.fn();
        this.ping = jest.fn((cb) => cb && cb());
        this.isAlive = true;
        this.on = super.on;
        this.once = super.once;
        this.addEventListener = jest.fn((type, listener, options) => {
            if (type === 'open')
                this.onopen = listener;
            if (type === 'message')
                this.onmessage = listener;
            if (type === 'close')
                this.onclose = listener;
            if (type === 'error')
                this.onerror = listener;
        });
        this.removeEventListener = jest.fn((type, listener, options) => {
        });
        this.dispatchEvent = jest.fn((event) => {
            return true;
        });
        this.id = id;
    }
    _triggerOpen() {
        this.readyState = this.OPEN;
        if (this.onopen) {
            this.onopen(new Event('open'));
        }
    }
    _triggerMessage(data) {
        if (this.onmessage) {
            this.onmessage(new MessageEvent('message', { data }));
        }
    }
    _triggerClose(code = 1000, reason) {
        this.readyState = this.CLOSED;
        if (this.onclose) {
            this.onclose(new CloseEvent('close', { code, reason }));
        }
    }
    _triggerError(error) {
        if (this.onerror) {
            this.onerror(new Event('error'));
        }
    }
}
exports.MockWebSocket = MockWebSocket;
exports.WebSocket = jest.fn().mockImplementation(() => {
    return new MockWebSocket();
});
Object.defineProperty(exports.WebSocket, 'Server', {
    value: jest.fn(() => mockServer),
    writable: true
});
Object.defineProperty(exports.WebSocket, 'WebSocket', {
    value: exports.WebSocket,
    writable: true
});
Object.defineProperty(exports.WebSocket, 'CONNECTING', {
    value: 0,
    writable: true
});
Object.defineProperty(exports.WebSocket, 'OPEN', {
    value: 1,
    writable: true
});
Object.defineProperty(exports.WebSocket, 'CLOSING', {
    value: 2,
    writable: true
});
Object.defineProperty(exports.WebSocket, 'CLOSED', {
    value: 3,
    writable: true
});
exports.default = exports.WebSocket;
//# sourceMappingURL=ws.js.map