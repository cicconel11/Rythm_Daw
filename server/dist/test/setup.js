"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env.test' });
jest.mock('ws', () => {
    class MockWebSocket {
        constructor() {
            this.readyState = MockWebSocket.OPEN;
            this.bufferedAmount = 0;
            this.onopen = null;
            this.onmessage = null;
            this.onclose = null;
            this.onerror = null;
            this.send = jest.fn((data, cb) => cb());
            this.close = jest.fn();
            this.terminate = jest.fn();
            this.pause = jest.fn();
            this.resume = jest.fn();
            this.addEventListener = jest.fn();
            this.removeEventListener = jest.fn();
            this.dispatchEvent = jest.fn();
            setTimeout(() => {
                if (this.onopen)
                    this.onopen();
            }, 10);
        }
    }
    MockWebSocket.CONNECTING = 0;
    MockWebSocket.OPEN = 1;
    MockWebSocket.CLOSING = 2;
    MockWebSocket.CLOSED = 3;
    const mockServer = {
        on: jest.fn(),
        close: jest.fn((cb) => cb()),
        address: jest.fn(() => ({ port: 8080 })),
    };
    const mockWebSocket = MockWebSocket;
    mockWebSocket.Server = jest.fn(() => mockServer);
    mockWebSocket.WebSocket = MockWebSocket;
    return mockWebSocket;
});
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn().mockReturnValue({ sub: 'test-user' }),
    sign: jest.fn().mockReturnValue('test-token'),
    decode: jest.fn().mockReturnValue({ sub: 'test-user' }),
}));
jest.mock('rate-limiter-flexible', () => {
    return {
        RateLimiterMemory: jest.fn().mockImplementation(() => ({
            consume: jest.fn().mockResolvedValue(1),
            get: jest.fn().mockResolvedValue({ remainingPoints: 100 }),
            delete: jest.fn().mockResolvedValue(true),
        })),
    };
});
//# sourceMappingURL=setup.js.map