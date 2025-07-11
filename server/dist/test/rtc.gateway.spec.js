"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtc_gateway_1 = require("../src/modules/rtc/rtc.gateway");
class MockAdapter {
    constructor() {
        this.rooms = new Map();
        this.sids = new Map();
    }
    async addAll(id, rooms) {
        if (!this.sids.has(id)) {
            this.sids.set(id, new Set());
        }
        for (const room of rooms) {
            if (!this.rooms.has(room)) {
                this.rooms.set(room, new Set());
            }
            this.rooms.get(room)?.add(id);
            this.sids.get(id)?.add(room);
        }
    }
    async del(id, room) {
        this.rooms.get(room)?.delete(id);
        this.sids.get(id)?.delete(room);
        if (this.rooms.get(room)?.size === 0) {
            this.rooms.delete(room);
        }
        if (this.sids.get(id)?.size === 0) {
            this.sids.delete(id);
        }
        return Promise.resolve();
    }
    async delAll(id) {
        const rooms = this.sids.get(id) || new Set();
        for (const room of rooms) {
            this.rooms.get(room)?.delete(id);
            if (this.rooms.get(room)?.size === 0) {
                this.rooms.delete(room);
            }
        }
        this.sids.delete(id);
        return Promise.resolve();
    }
}
class MockLogger {
    constructor() {
        this.log = jest.fn();
        this.error = jest.fn();
        this.warn = jest.fn();
        this.debug = jest.fn();
        this.verbose = jest.fn();
        this.fatal = jest.fn();
    }
}
const mockLogger = new MockLogger();
jest.mock('../src/auth/guards/jwt-ws-auth.guard', () => ({
    JwtWsAuthGuard: () => ({
        canActivate: () => true,
    }),
}));
class TestRtcGateway extends rtc_gateway_1.RtcGateway {
    constructor() {
        super();
        this.testSockets = new Map();
        this.logger = mockLogger;
        this.testServer = this.createTestServer();
        this.testServer = this.testServer;
    }
    createTestServer() {
        return {
            sockets: {
                sockets: new Map(),
            },
            to: jest.fn().mockImplementation(() => ({
                emit: jest.fn(),
            })),
            emit: jest.fn(),
        };
    }
    createTestSocket(user = {}) {
        const id = `test-socket-${Math.random().toString(36).substr(2, 9)}`;
        const userData = {
            userId: user.userId || 'test-user',
            email: user.email || 'test@example.com',
            name: user.name || 'Test User'
        };
        const socket = {
            id,
            user: userData,
            handshake: {
                user: userData,
                headers: {},
                time: new Date().toISOString(),
                address: '127.0.0.1',
                xdomain: false,
                secure: true,
                issued: Date.now(),
                url: '/',
                query: {},
            },
            join: jest.fn().mockReturnThis(),
            leave: jest.fn().mockReturnThis(),
            disconnect: jest.fn(),
            emit: jest.fn(),
            to: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            connected: true,
            disconnected: false,
            nsp: {
                name: '/',
                adapter: new MockAdapter(),
            },
            client: {
                conn: {
                    remoteAddress: '127.0.0.1',
                },
            },
            data: {},
            request: {
                headers: {},
            },
        };
        this.testServer.sockets.sockets.set(id, socket);
        this.testSockets.set(id, socket);
        return socket;
    }
    testEmitToUser(userId, event, data) {
        return this.emitToUser(userId, event, data);
    }
    testHandleConnection(client) {
        return this.handleConnection(client);
    }
    testHandleDisconnect(client) {
        return this.handleDisconnect(client);
    }
}
describe('RtcGateway', () => {
    let gateway;
    beforeEach(() => {
        gateway = new TestRtcGateway();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('handleConnection', () => {
        it('should handle connection and store socket', async () => {
            const client = gateway.createTestSocket({ userId: 'user1' });
            await gateway.testHandleConnection(client);
            expect(client.join).toHaveBeenCalledWith('user1');
            expect(gateway['userSockets'].has('user1')).toBe(true);
            expect(gateway['socketToUser'].get(client.id)).toBe('user1');
        });
    });
    describe('handleDisconnect', () => {
        it('should handle disconnection and clean up', async () => {
            const client = gateway.createTestSocket({ userId: 'user1' });
            await gateway.testHandleConnection(client);
            client.connected = false;
            await gateway.testHandleDisconnect(client);
            expect(client.leave).toHaveBeenCalled();
            expect(gateway['userSockets'].get('user1')?.has(client.id)).toBe(false);
            expect(gateway['socketToUser'].has(client.id)).toBe(false);
        });
    });
    describe('emitToUser', () => {
        it('should emit event to user', async () => {
            const client = gateway.createTestSocket({ userId: 'user1' });
            await gateway.testHandleConnection(client);
            const result = gateway.testEmitToUser('user1', 'test-event', { data: 'test' });
            expect(result).toBe(true);
            expect(client.emit).toHaveBeenCalledWith('test-event', { data: 'test' });
        });
        it('should handle non-existent user', () => {
            const result = gateway.testEmitToUser('non-existent', 'test-event', {});
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=rtc.gateway.spec.js.map