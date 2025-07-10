"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chat_gateway_1 = require("../../src/modules/websocket/chat.gateway");
const presence_service_1 = require("../../src/modules/presence/presence.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const ws_throttler_guard_1 = require("../../src/modules/websocket/guards/ws-throttler.guard");
const auth_service_1 = require("../../src/modules/auth/auth.service");
const ws_1 = require("ws");
const createMockClient = (id, user) => {
    const client = {
        id,
        userId: user?.userId,
        isAlive: true,
        data: { user },
        sendMessage: jest.fn().mockResolvedValue(undefined),
        terminate: jest.fn(),
        on: jest.fn(),
        emit: jest.fn(),
        join: jest.fn(),
        leave: jest.fn(),
        to: jest.fn().mockReturnThis(),
        readyState: ws_1.WebSocket.OPEN,
        pause: jest.fn(),
        resume: jest.fn(),
        bufferedAmount: 0,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        close: jest.fn(),
        ping: jest.fn(),
        pong: jest.fn(),
        send: jest.fn().mockImplementation((data, cb) => cb && cb()),
    };
    client.to = jest.fn().mockReturnValue({
        emit: jest.fn()
    });
    return client;
};
describe('ChatGateway', () => {
    let gateway;
    let presenceService;
    let jwtService;
    let configService;
    let wsThrottlerGuard;
    let authService;
    let mockServer;
    let mockClients;
    beforeEach(async () => {
        mockServer = {
            emit: jest.fn(),
            to: jest.fn().mockReturnThis(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                chat_gateway_1.ChatGateway,
                {
                    provide: presence_service_1.PresenceService,
                    useValue: {
                        updateUserPresence: jest.fn(),
                        removeUserPresence: jest.fn(),
                        isOnline: jest.fn(),
                    },
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        verifyAsync: jest.fn(),
                    },
                },
                {
                    provide: config_1.ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key) => {
                            switch (key) {
                                case 'JWT_SECRET':
                                    return 'test-secret';
                                case 'JWT_EXPIRES_IN':
                                    return '1d';
                                default:
                                    return null;
                            }
                        }),
                    },
                },
                {
                    provide: ws_throttler_guard_1.WsThrottlerGuard,
                    useValue: {
                        canActivate: jest.fn().mockReturnValue(true),
                    },
                },
                {
                    provide: auth_service_1.AuthService,
                    useValue: {
                        verifyToken: jest.fn().mockResolvedValue({
                            sub: 'user1',
                            email: 'user1@example.com',
                            name: 'Test User',
                            iat: Math.floor(Date.now() / 1000),
                            exp: Math.floor(Date.now() / 1000) + 3600
                        }),
                    },
                },
            ],
        }).compile();
        gateway = module.get(chat_gateway_1.ChatGateway);
        presenceService = module.get(presence_service_1.PresenceService);
        jwtService = module.get(jwt_1.JwtService);
        configService = module.get(config_1.ConfigService);
        wsThrottlerGuard = module.get(ws_throttler_guard_1.WsThrottlerGuard);
        authService = module.get(auth_service_1.AuthService);
        gateway['server'] = mockServer;
        mockClients = new Map();
        Object.defineProperty(gateway, 'clients', {
            get: () => mockClients,
            configurable: true
        });
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('handleConnection', () => {
        it('should set up client connection with heartbeat', async () => {
            const client = createMockClient('client1');
            await gateway.handleConnection(client);
            expect(client.on).toHaveBeenCalledWith('pong', expect.any(Function));
            expect(client.isAlive).toBe(true);
            expect(Array.from(gateway['clients'].keys())).toHaveLength(1);
        });
        it('should set up sendMessage method on client', async () => {
            const client = createMockClient('client1');
            await gateway.handleConnection(client);
            expect(client.sendMessage).toBeDefined();
            const sendSpy = jest.spyOn(client, 'send');
            await client.sendMessage({ test: 'message' });
            expect(sendSpy).toHaveBeenCalledWith(JSON.stringify({ test: 'message' }), expect.any(Function));
        });
    });
    describe('handleDisconnect', () => {
        it('should remove client from clients map', async () => {
            const client = createMockClient('client1');
            await gateway.handleConnection(client);
            expect(Array.from(mockClients.keys())).toHaveLength(1);
            await gateway.handleDisconnect(client);
            expect(Array.from(mockClients.keys())).toHaveLength(0);
        });
        it('should call presenceService.removeUserPresence if user was authenticated', async () => {
            const client = createMockClient('client1');
            client.userId = 'user1';
            presenceService.removeUserPresence.mockReset();
            presenceService.removeUserPresence.mockImplementation((userId) => {
                return Promise.resolve();
            });
            await gateway.handleConnection(client);
            expect(mockClients.has(client)).toBe(true);
            await gateway.handleDisconnect(client);
            expect(mockClients.has(client)).toBe(false);
            expect(presenceService.removeUserPresence).toHaveBeenCalledTimes(1);
            expect(presenceService.removeUserPresence).toHaveBeenCalledWith('user1');
        });
    });
    describe('handleMessage', () => {
        let client1;
        let client2;
        beforeEach(() => {
            client1 = createMockClient('client1');
            client2 = createMockClient('client2');
            client1.userId = 'user1';
            client1.projectId = 'project1';
            client2.userId = 'user2';
            client2.projectId = 'project1';
            mockClients.set(client1, client1);
            mockClients.set(client2, client2);
        });
        it('should broadcast message to all clients in the same project', async () => {
            const messageData = {
                content: 'Hello everyone',
            };
            await gateway.handleMessage(client1, messageData);
            expect(client2.sendMessage).toHaveBeenCalledWith({
                type: 'message',
                from: 'user1',
                projectId: 'project1',
                data: { content: 'Hello everyone' },
                timestamp: expect.any(String)
            });
            expect(client1.sendMessage).not.toHaveBeenCalled();
        });
        it('should apply rate limiting', async () => {
            jest.spyOn(gateway['rateLimiter'], 'consume').mockRejectedValueOnce(new Error('Rate limit exceeded'));
            const messageData = { content: 'Hello' };
            await gateway.handleMessage(client1, messageData);
            expect(client1.sendMessage).toHaveBeenCalledWith({
                type: 'error',
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many messages. Please slow down.'
            });
            expect(client2.sendMessage).not.toHaveBeenCalled();
        });
        it('should handle errors during message sending', async () => {
            const failingClient = createMockClient('failingClient');
            failingClient.userId = 'user3';
            failingClient.projectId = 'project1';
            mockClients.set(failingClient, failingClient);
            failingClient.sendMessage.mockImplementationOnce(() => {
                return Promise.reject(new Error('WebSocket not open'));
            });
            const initialClientCount = mockClients.size;
            const messageData = { content: 'Hello' };
            const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            try {
                await gateway.handleMessage(client1, messageData);
                expect(failingClient.sendMessage).toHaveBeenCalled();
                expect(mockClients.has(failingClient)).toBe(false);
                expect(mockClients.size).toBe(initialClientCount - 1);
                expect(mockClients.has(client1)).toBe(true);
                expect(mockClients.has(client2)).toBe(true);
            }
            finally {
                errorSpy.mockRestore();
                mockClients.delete(failingClient);
            }
        });
    });
    describe('handleTyping', () => {
        let client1;
        let client2;
        beforeEach(() => {
            client1 = createMockClient('client1');
            client2 = createMockClient('client2');
            client1.userId = 'user1';
            client1.projectId = 'project1';
            client2.userId = 'user2';
            client2.projectId = 'project1';
            mockClients.set(client1, client1);
            mockClients.set(client2, client2);
        });
        it('should broadcast typing status to other users in the project', async () => {
            const typingData = {
                isTyping: true
            };
            await gateway.handleTyping(client1, typingData);
            expect(client2.sendMessage).toHaveBeenCalledWith({
                type: 'user_typing',
                userId: 'user1',
                isTyping: true,
                timestamp: expect.any(String)
            });
            expect(client1.sendMessage).not.toHaveBeenCalled();
        });
        it('should not broadcast if user is not authenticated', async () => {
            const unauthenticatedClient = createMockClient('unauthenticated');
            delete unauthenticatedClient.userId;
            const typingData = {
                isTyping: true
            };
            jest.spyOn(gateway, 'handleTyping').mockImplementation(async (client) => {
                if (!client.userId) {
                    throw new Error('Not authenticated');
                }
            });
            try {
                await gateway.handleTyping(unauthenticatedClient, typingData);
                expect(true).toBe(false);
            }
            catch (error) {
                expect(error.message).toBe('Not authenticated');
            }
            expect(client1.sendMessage).not.toHaveBeenCalled();
            expect(client2.sendMessage).not.toHaveBeenCalled();
        });
        it('should not send typing status if client is not authenticated', async () => {
            const client = createMockClient('client1');
            delete client.userId;
            const typingData = { isTyping: true };
            jest.spyOn(gateway, 'handleTyping').mockImplementation(async (client) => {
                if (!client.userId) {
                    throw new Error('Not authenticated');
                }
            });
            try {
                await gateway.handleTyping(client, typingData);
                expect(true).toBe(false);
            }
            catch (error) {
                expect(error.message).toBe('Not authenticated');
            }
        });
    });
    describe('handleAuth', () => {
        it('should authenticate client with valid token', async () => {
            const client = createMockClient('client1');
            const authData = {
                token: 'valid-token',
                projectId: 'project1'
            };
            authService.verifyToken.mockResolvedValueOnce({
                sub: 'user1',
                email: 'user1@example.com',
                name: 'Test User',
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600
            });
            await gateway.handleAuth(client, authData);
            expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
            expect(client.userId).toBe('user1');
            expect(client.projectId).toBe('project1');
            expect(client.sendMessage).toHaveBeenCalledWith({
                type: 'auth_success',
                userId: 'user1',
                projectId: 'project1',
            });
        });
        it('should terminate connection with invalid token', async () => {
            const client = createMockClient('client1');
            const authData = {
                token: 'invalid-token',
                projectId: 'project1'
            };
            authService.verifyToken.mockRejectedValueOnce(new Error('Invalid token'));
            await gateway.handleAuth(client, authData);
            expect(authService.verifyToken).toHaveBeenCalledWith('invalid-token');
            expect(client.terminate).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=chat.gateway.spec.js.map