"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rtc_gateway_1 = require("../src/modules/rtc/rtc.gateway");
const jwt_ws_auth_guard_1 = require("../src/modules/auth/guards/jwt-ws-auth.guard");
const jwt_1 = require("@nestjs/jwt");
const socket_mock_1 = require("./__utils__/socket-mock");
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const mockJwtService = {
    verify: jest.fn().mockImplementation((token) => ({
        sub: 'test-user-id',
        email: 'test@example.com',
    })),
};
const mockJwtWsAuthGuard = {
    canActivate: jest.fn().mockImplementation((context) => {
        const client = context.switchToWs().getClient();
        client.user = { sub: 'test-user-id' };
        return true;
    }),
};
let mockServer;
let mockClient1;
let mockClient2;
let mockClient3;
describe('RtcGateway', () => {
    let gateway;
    let mockClient1;
    let mockClient2;
    let mockClient3;
    beforeAll(() => {
        jest.unmock('ws');
        mockServer = (0, socket_mock_1.createMockServer)();
    });
    beforeEach(async () => {
        jest.clearAllMocks();
        mockClient1 = (0, socket_mock_1.createMockSocket)(generateUUID());
        mockClient2 = (0, socket_mock_1.createMockSocket)(generateUUID());
        mockClient3 = (0, socket_mock_1.createMockSocket)(generateUUID());
        mockClient1.user = { sub: 'user-1' };
        mockClient2.user = { sub: 'user-2' };
        mockClient3.user = { sub: 'user-3' };
        mockServer.sockets.sockets.set(mockClient1.id, mockClient1);
        mockServer.sockets.sockets.set(mockClient2.id, mockClient2);
        mockServer.sockets.sockets.set(mockClient3.id, mockClient3);
        const module = await testing_1.Test.createTestingModule({
            providers: [
                rtc_gateway_1.RtcGateway,
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        })
            .overrideGuard(jwt_ws_auth_guard_1.JwtWsAuthGuard)
            .useValue(mockJwtWsAuthGuard)
            .compile();
        gateway = module.get(rtc_gateway_1.RtcGateway);
        gateway.userSockets = new Map();
        gateway.socketToUser = new Map();
        gateway['server'] = mockServer;
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('handleConnection', () => {
        it('should add client to connected clients', async () => {
            const joinSpy = jest.spyOn(mockClient1, 'join');
            const emitSpy = jest.spyOn(mockClient1, 'emit');
            await gateway.handleConnection(mockClient1);
            expect(joinSpy).toHaveBeenCalledWith('user-1');
            expect(gateway.userSockets.has('user-1')).toBe(true);
            expect(gateway.userSockets.get('user-1').has(mockClient1.id)).toBe(true);
            expect(gateway.socketToUser.get(mockClient1.id)).toBe('user-1');
            expect(emitSpy).toHaveBeenCalledWith('connection-success', { userId: 'user-1' });
        });
        it('should disconnect client if no user ID', async () => {
            const badClient = {
                ...mockClient1,
                user: null,
                disconnect: jest.fn(),
            };
            const disconnectSpy = jest.spyOn(badClient, 'disconnect');
            await gateway.handleConnection(badClient);
            expect(disconnectSpy).toHaveBeenCalled();
        });
        it('should handle connection errors', async () => {
            const error = new Error('Connection error');
            const joinSpy = jest.spyOn(mockClient1, 'join').mockRejectedValueOnce(error);
            const disconnectSpy = jest.spyOn(mockClient1, 'disconnect');
            const originalLogger = gateway.logger;
            const mockLogger = {
                error: jest.fn(),
            };
            gateway.logger = mockLogger;
            await gateway.handleConnection(mockClient1);
            expect(mockLogger.error).toHaveBeenCalled();
            expect(disconnectSpy).toHaveBeenCalled();
            gateway.logger = originalLogger;
        });
    });
    describe('handleDisconnect', () => {
        it('should remove client from connected clients', async () => {
            await gateway.handleConnection(mockClient1);
            const userSockets = gateway.userSockets.get('user-1');
            expect(userSockets).toBeDefined();
            expect(userSockets.has(mockClient1.id)).toBe(true);
            expect(gateway.socketToUser.get(mockClient1.id)).toBe('user-1');
            await gateway.handleDisconnect(mockClient1);
            const updatedUserSockets = gateway.userSockets.get('user-1');
            expect(updatedUserSockets).toBeUndefined();
            expect(gateway.socketToUser.has(mockClient1.id)).toBe(false);
        });
        it('should handle unknown client disconnection', () => {
            expect(() => {
                gateway.handleDisconnect(mockClient1);
            }).not.toThrow();
            expect(gateway.userSockets.has('user-1')).toBe(false);
            expect(gateway.socketToUser.has(mockClient1.id)).toBe(false);
        });
    });
    describe('emitToUser', () => {
        it('should emit event to all user sockets', () => {
            const userId = generateUUID();
            const event = 'test-event';
            const payload = { data: 'test' };
            const mockSocket1 = (0, socket_mock_1.createMockSocket)(generateUUID());
            const mockSocket2 = (0, socket_mock_1.createMockSocket)(generateUUID());
            mockSocket1.user = { sub: userId };
            mockSocket2.user = { sub: userId };
            mockSocket1.handshake = { auth: { token: 'valid-token' } };
            mockSocket2.handshake = { auth: { token: 'valid-token' } };
            gateway.userSockets.set(userId, new Set([mockSocket1.id, mockSocket2.id]));
            gateway.socketToUser.set(mockSocket1.id, userId);
            gateway.socketToUser.set(mockSocket2.id, userId);
            const emitSpy1 = jest.spyOn(mockSocket1, 'emit');
            const emitSpy2 = jest.spyOn(mockSocket2, 'emit');
            mockServer.sockets.sockets.set(mockSocket1.id, mockSocket1);
            mockServer.sockets.sockets.set(mockSocket2.id, mockSocket2);
            gateway.emitToUser(userId, event, payload);
            expect(emitSpy1).toHaveBeenCalledWith(event, payload);
            expect(emitSpy2).toHaveBeenCalledWith(event, payload);
        });
        it('should return false if user has no sockets', () => {
            const result = gateway.emitToUser('non-existent-user', 'test-event', {});
            expect(result).toBe(false);
        });
        it('should handle missing server', () => {
            const originalServer = gateway['server'];
            gateway['server'] = null;
            const result = gateway.emitToUser('test-user', 'test-event', {});
            gateway['server'] = originalServer;
            expect(result).toBe(false);
        });
    });
    describe('registerWsServer', () => {
        it('should register a WebSocket server instance', () => {
            const mockServerInstance = {};
            gateway.registerWsServer(mockServerInstance);
            expect(gateway['server']).toBe(mockServerInstance);
        });
    });
});
//# sourceMappingURL=rtc.gateway.spec.js.map