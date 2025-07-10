"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtc_gateway_1 = require("../src/modules/rtc/rtc.gateway");
jest.mock('../src/modules/auth/guards/jwt-ws-auth.guard', () => ({
    JwtWsAuthGuard: jest.fn().mockImplementation(() => ({
        canActivate: (context) => {
            const client = context.switchToWs().getClient();
            client.user = { sub: 'test-user-id' };
            return true;
        },
    })),
}));
class TestRtcGateway extends rtc_gateway_1.RtcGateway {
    constructor() {
        super();
        this['userSockets'] = new Map();
        this['socketToUser'] = new Map();
        this.setupServerMock();
        Object.defineProperty(this, 'server', {
            get: () => this._testServer,
            set: (server) => { this._testServer = server; },
            configurable: true
        });
    }
    async afterInit() {
    }
    getJwtService() {
        return this.jwtService;
    }
    getConfigService() {
        return this.configService;
    }
    setupServerMock(client) {
        this._testServer = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn().mockReturnThis(),
            in: jest.fn().mockReturnThis(),
            sockets: {
                sockets: new Map(client ? [[client.id, client]] : []),
                adapter: {
                    rooms: new Map(),
                    sids: new Map(),
                    addAll: jest.fn(),
                    del: jest.fn(),
                    delAll: jest.fn(),
                    broadcast: {
                        to: jest.fn().mockReturnThis(),
                        emit: jest.fn(),
                        compress: jest.fn().mockReturnThis(),
                        volatile: jest.fn().mockReturnThis(),
                        local: jest.fn().mockReturnThis()
                    }
                },
                join: jest.fn(),
                leave: jest.fn(),
                disconnect: jest.fn(),
            },
            of: jest.fn().mockReturnThis(),
            use: jest.fn().mockReturnThis(),
            engine: {
                generateId: jest.fn().mockReturnValue('mock-socket-id')
            }
        };
    }
    testHandleConnection(client) {
        return this.handleConnection(client);
    }
    testHandleDisconnect(client) {
        return this.handleDisconnect(client);
    }
    testEmitToUser(userId, event, payload) {
        return this.emitToUser(userId, event, payload);
    }
    getTestServer() {
        return this._testServer;
    }
}
describe('RtcGateway', () => {
    let gateway;
    let jwtService;
    let configService;
    beforeEach(async () => {
        gateway = new TestRtcGateway();
        jwtService = {
            verify: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
        };
        configService = {
            get: jest.fn((key) => ({
                'JWT_SECRET': 'test-secret',
                'NODE_ENV': 'test',
            })[key]),
        };
        gateway.jwtService = jwtService;
        gateway.configService = configService;
        await gateway.afterInit();
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('emitToUser', () => {
        it('should emit events to all user sockets', () => {
            const userId = 'test-user-1';
            const event = 'test-event';
            const data = { test: 'data' };
            const mockSocket1 = {
                id: 'test-client-1',
                emit: jest.fn(),
            };
            const mockSocket2 = {
                id: 'test-client-2',
                emit: jest.fn(),
            };
            const testServer = {
                sockets: {
                    sockets: new Map([
                        ['test-client-1', mockSocket1],
                        ['test-client-2', mockSocket2],
                    ]),
                },
            };
            gateway['_testServer'] = testServer;
            gateway['userSockets'] = new Map([
                [userId, new Set([mockSocket1.id, mockSocket2.id])]
            ]);
            gateway['socketToUser'] = new Map([
                [mockSocket1.id, userId],
                [mockSocket2.id, userId],
            ]);
            const result = gateway.testEmitToUser(userId, event, data);
            expect(result).toBe(true);
            expect(mockSocket1.emit).toHaveBeenCalledWith(event, data);
            expect(mockSocket2.emit).toHaveBeenCalledWith(event, data);
        });
    });
    describe('getTestServer', () => {
        it('should return the test server instance', () => {
            const testServer = gateway.getTestServer();
            expect(testServer).toBeDefined();
            expect(testServer.to).toBeDefined();
            expect(testServer.emit).toBeDefined();
        });
    });
    afterAll(async () => {
    });
});
describe('RtcGateway', () => {
    let gateway;
    beforeEach(() => {
        gateway = new TestRtcGateway();
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('handleConnection', () => {
        it('should disconnect client if no user in handshake', async () => {
            const mockSocket = {
                id: 'test-client-id',
                handshake: {
                    auth: {},
                    headers: {},
                    time: new Date().toISOString(),
                    address: '127.0.0.1',
                    xdomain: false,
                    secure: false,
                    issued: Date.now(),
                    url: '/',
                    query: {},
                },
                disconnect: jest.fn(),
                on: jest.fn(),
                join: jest.fn(),
                leave: jest.fn(),
                emit: jest.fn(),
            };
            gateway.setupServerMock(mockSocket);
            await gateway.testHandleConnection(mockSocket);
            expect(mockSocket.disconnect).toHaveBeenCalled();
        });
        it('should handle connection with valid user', async () => {
            const client = {
                handshake: {
                    auth: {
                        token: 'valid-token',
                    },
                },
                join: jest.fn().mockResolvedValue(undefined),
                id: 'test-client-id',
                user: { sub: 'test-user-id' },
                disconnect: jest.fn(),
            };
            gateway.setupServerMock(client);
            await gateway.testHandleConnection(client);
            expect(gateway['userSockets'].has('test-user-id')).toBe(true);
            expect(gateway['socketToUser'].has('test-client-id')).toBe(true);
            await gateway.testHandleDisconnect(client);
            expect(gateway['userSockets'].has('test-user-id')).toBe(false);
            expect(gateway['socketToUser'].has('test-client-id')).toBe(false);
        });
        it('should handle connection without user', async () => {
            const mockJwtService = {
                verify: jest.fn().mockImplementation(() => {
                    throw new Error('Invalid token');
                })
            };
            gateway.jwtService = mockJwtService;
            const client = {
                handshake: {
                    auth: {
                        token: 'invalid-token',
                    },
                    headers: {},
                    time: new Date().toISOString(),
                    address: '127.0.0.1',
                    xdomain: false,
                    secure: false,
                    issued: Date.now(),
                    url: '/',
                    query: {},
                },
                id: 'test-client-id',
                disconnect: jest.fn(),
                on: jest.fn(),
                join: jest.fn(),
                leave: jest.fn(),
                emit: jest.fn(),
            };
            gateway.setupServerMock(client);
            await gateway.testHandleConnection(client);
            expect(client.disconnect).toHaveBeenCalled();
        });
    });
    describe('handleDisconnect', () => {
        it('should clean up user connections on disconnect', async () => {
            const mockSocket = {
                id: 'test-client-id',
                user: { sub: 'test-user-id' },
                handshake: {
                    auth: {},
                    headers: {},
                    time: new Date().toISOString(),
                    address: '127.0.0.1',
                    xdomain: false,
                    secure: false,
                    issued: Date.now(),
                    url: '/',
                    query: {},
                },
                disconnect: jest.fn(),
                on: jest.fn(),
                join: jest.fn(),
                leave: jest.fn(),
                emit: jest.fn(),
            };
            gateway['userSockets'].set('test-user-id', new Set([mockSocket.id]));
            gateway['socketToUser'].set(mockSocket.id, 'test-user-id');
            gateway.setupServerMock(mockSocket);
            await gateway.testHandleDisconnect(mockSocket);
            expect(gateway['userSockets'].has('test-user-id')).toBe(false);
            expect(gateway['socketToUser'].has('test-client-id')).toBe(false);
        });
    });
    describe('emitToUser', () => {
        let mockSocket;
        beforeEach(() => {
            mockSocket = {
                id: 'test-client-1',
                emit: jest.fn(),
                user: { sub: 'test-user-1' },
                handshake: {
                    auth: {},
                    headers: {},
                    time: new Date().toISOString(),
                    address: '127.0.0.1',
                    xdomain: false,
                    secure: false,
                    issued: Date.now(),
                    url: '/',
                    query: {},
                },
                disconnect: jest.fn(),
                on: jest.fn(),
                join: jest.fn(),
                leave: jest.fn(),
            };
            gateway = new TestRtcGateway();
            gateway['userSockets'].set('test-user-1', new Set([mockSocket.id]));
            gateway['socketToUser'].set(mockSocket.id, 'test-user-1');
            gateway.setupServerMock(mockSocket);
        });
        it('should emit event to all user sockets', () => {
            const testEvent = 'test-event';
            const testPayload = { data: 'test' };
            const result = gateway.testEmitToUser('test-user-1', testEvent, testPayload);
            expect(result).toBe(true);
            expect(mockSocket.emit).toHaveBeenCalledWith(testEvent, testPayload);
        });
        it('should return false if user has no sockets', () => {
            const result = gateway.testEmitToUser('non-existent-user', 'test-event', {});
            expect(result).toBe(false);
        });
        it('should handle missing server.sockets.sockets', () => {
            const testServer = gateway.getTestServer();
            testServer.sockets = {};
            const result = gateway.testEmitToUser('test-user-1', 'test-event', {});
            expect(result).toBe(false);
        });
        it('should handle missing server', () => {
            gateway.setupServerMock();
            const result = gateway.testEmitToUser('test-user-1', 'test-event', {});
            expect(result).toBe(false);
        });
    });
});
//# sourceMappingURL=rtc.gateway.spec.js.map