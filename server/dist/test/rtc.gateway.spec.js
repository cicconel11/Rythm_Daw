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
    socketRooms(id) {
        return this.sids.get(id) || new Set();
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
        canActivate: (context) => {
            const client = context.getArgByIndex(0);
            if (!client.handshake?.auth?.token) {
                return false;
            }
            client.user = { userId: 'test-user', email: 'test@example.com' };
            return true;
        },
    }),
}));
class TestRtcGateway extends rtc_gateway_1.RtcGateway {
    constructor() {
        super();
        this.testSockets = new Map();
        this.logger = mockLogger;
        this.testServer = this.createTestServer();
        this.server = this.testServer;
    }
    createTestServer() {
        const adapter = new MockAdapter();
        return {
            sockets: {
                sockets: this.testSockets,
                adapter: adapter,
            },
            of: jest.fn().mockReturnThis(),
            emit: jest.fn(),
            to: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            server: {},
            on: jest.fn(),
            use: jest.fn(),
            close: jest.fn(),
            listen: jest.fn(),
            attach: jest.fn(),
            path: jest.fn(),
            adapter: adapter,
        };
    }
    createTestSocket(user = {}) {
        const userId = user.userId || 'test-user';
        const socket = {
            id: `socket-${Date.now()}`,
            user: {
                userId,
                email: user.email || 'test@example.com',
                name: user.name || 'Test User',
            },
            handshake: {
                user: {
                    userId,
                    email: user.email || 'test@example.com',
                    name: user.name || 'Test User',
                },
                headers: {},
                time: new Date().toISOString(),
                address: '::1',
                xdomain: false,
                secure: false,
                issued: Date.now(),
                url: '/',
                query: {},
                auth: { token: 'test-token' },
            },
            rooms: new Set(),
            join: jest.fn().mockImplementation((room) => {
                socket.rooms.add(room);
                return Promise.resolve();
            }),
            leave: jest.fn().mockImplementation((room) => {
                socket.rooms.delete(room);
                return Promise.resolve();
            }),
            disconnect: jest.fn().mockImplementation(() => {
                socket.connected = false;
                socket.disconnected = true;
            }),
            emit: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis(),
            once: jest.fn().mockReturnThis(),
            removeListener: jest.fn().mockReturnThis(),
            removeAllListeners: jest.fn().mockReturnThis(),
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
                    remoteAddress: '::1',
                },
            },
            data: {},
            request: {
                headers: {},
            },
        };
        this.testSockets.set(socket.id, socket);
        return socket;
    }
    async testEmitToUser(userId, event, data) {
        return this.emitToUser(userId, event, data);
    }
    async testHandleConnection(client) {
        return this.handleConnection(client);
    }
    async testHandleDisconnect(client) {
        await this.handleDisconnect({
            id: client.id,
            handshake: { user: { userId: 'test-user' } },
            on: jest.fn(),
            removeListener: jest.fn(),
            disconnect: jest.fn(),
        });
        this.testSockets.delete(client.id);
    }
}
describe('RtcGateway', () => {
    let gateway;
    beforeEach(() => {
        jest.clearAllMocks();
        gateway = new TestRtcGateway();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('handleConnection', () => {
        it('should handle connection with valid user', async () => {
            const user = { userId: 'test-user', email: 'test@example.com' };
            const socket = gateway.createTestSocket(user);
            await gateway.testHandleConnection(socket);
            expect(gateway.testSockets.get(socket.id)).toBeDefined();
            expect(socket.emit).toHaveBeenCalledWith('rtc:connection-success', {
                userId: user.userId,
                email: user.email,
                name: 'Test User',
                socketId: socket.id
            });
            expect(socket.emit).toHaveBeenCalledWith('rtc:online-users', {
                users: expect.any(Array)
            });
        });
        it('should disconnect if user is missing', async () => {
            const socket = gateway.createTestSocket();
            socket.handshake.user = undefined;
            await gateway.testHandleConnection(socket);
            expect(socket.disconnect).toHaveBeenCalled();
            expect(mockLogger.warn).toHaveBeenCalledWith('Missing user in handshake – disconnecting', 'RtcGateway');
        });
    });
    describe('handleDisconnect', () => {
        it('should clean up user connections on disconnect', async () => {
            const user = { userId: 'test-user', email: 'test@example.com' };
            const socket = gateway.createTestSocket(user);
            gateway.testSockets.set(socket.id, socket);
            expect(gateway.testSockets.has(socket.id)).toBe(true);
            await gateway.testHandleDisconnect({ id: socket.id });
            expect(gateway.testSockets.has(socket.id)).toBe(false);
        });
    });
    describe('emitToUser', () => {
        it('should emit event to all user sockets', async () => {
            const user = { userId: 'test-user', email: 'test@example.com' };
            const socket1 = gateway.createTestSocket(user);
            const socket2 = gateway.createTestSocket(user);
            await gateway.testHandleConnection(socket1);
            await gateway.testHandleConnection(socket2);
            socket1.emit.mockClear();
            socket2.emit.mockClear();
            const event = 'test-event';
            const data = { message: 'test' };
            const result = await gateway.emitToUser(user.userId, event, data);
            expect(result).toBe(true);
            expect(result).toBe(true);
        });
        it('should handle case when user has no sockets', async () => {
            const result = await gateway.testEmitToUser('non-existent-user', 'test-event', {});
            expect(result).toBe(false);
            expect(mockLogger.warn).toHaveBeenCalledWith('Attempted to emit to user non-existent-user but no sockets found', 'RtcGateway');
        });
    });
});
//# sourceMappingURL=rtc.gateway.spec.js.map