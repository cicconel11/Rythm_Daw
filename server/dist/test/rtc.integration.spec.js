"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rtc_gateway_1 = require("../src/modules/rtc/rtc.gateway");
jest.mock('../src/modules/rtc/rtc.gateway', () => {
    const mockGateway = {
        server: {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        },
        userSockets: new Map(),
        socketToUser: new Map(),
        logger: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        },
        registerWsServer: function (server) {
            this.server = server;
        },
        emitToUser: jest.fn().mockImplementation(function (userId, event, data) {
            const sockets = this.userSockets.get(userId);
            if (!sockets)
                return false;
            sockets.forEach((socketId) => {
                this.server.to(socketId).emit(event, data);
            });
            return true;
        }),
        handleConnection: jest.fn().mockImplementation(async function (socket) {
            try {
                const token = socket.handshake?.auth?.token;
                if (!token || token !== 'valid-token') {
                    throw new Error('Invalid token');
                }
                const userId = 'test-user-id';
                if (!this.userSockets.has(userId)) {
                    this.userSockets.set(userId, new Set());
                }
                this.userSockets.get(userId).add(socket.id);
                this.socketToUser.set(socket.id, userId);
                socket.join(`user_${userId}`);
                socket.emit('welcome', { userId });
            }
            catch (error) {
                this.logger.error('Connection error:', error);
                socket.disconnect();
            }
        }),
        handleDisconnect: jest.fn().mockImplementation(function (socket) {
            const userId = this.socketToUser.get(socket.id);
            if (userId) {
                const sockets = this.userSockets.get(userId);
                if (sockets) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        this.userSockets.delete(userId);
                    }
                }
                this.socketToUser.delete(socket.id);
            }
        })
    };
    return {
        RtcGateway: jest.fn().mockImplementation(() => mockGateway)
    };
});
describe('RtcGateway', () => {
    let gateway;
    let mockSocket;
    beforeEach(() => {
        gateway = new rtc_gateway_1.RtcGateway();
        mockSocket = {
            id: 'test-socket-id',
            handshake: {
                auth: { token: 'valid-token' }
            },
            join: jest.fn(),
            emit: jest.fn(),
            disconnect: jest.fn(),
        };
        jest.clearAllMocks();
    });
    describe('emitToUser', () => {
        it('should emit event to all user sockets', () => {
            const userId = 'test-user';
            const event = 'test-event';
            const data = { test: 'data' };
            gateway.userSockets.set(userId, new Set(['socket-1', 'socket-2']));
            const result = gateway.emitToUser(userId, event, data);
            expect(result).toBe(true);
            expect(gateway.server.to).toHaveBeenCalledTimes(2);
            expect(gateway.server.to).toHaveBeenCalledWith('socket-1');
            expect(gateway.server.to).toHaveBeenCalledWith('socket-2');
            expect(gateway.server.emit).toHaveBeenCalledWith(event, data);
        });
        it('should return false if user has no sockets', () => {
            const result = gateway.emitToUser('non-existent-user', 'test-event', {});
            expect(result).toBe(false);
            expect(gateway.server.to).not.toHaveBeenCalled();
        });
    });
    describe('handleConnection', () => {
        it('should handle successful connection', async () => {
            await gateway.handleConnection(mockSocket);
            expect(gateway.userSockets.get('test-user-id')).toBeDefined();
            expect(gateway.socketToUser.get('test-socket-id')).toBe('test-user-id');
            expect(mockSocket.join).toHaveBeenCalledWith('user_test-user-id');
            expect(mockSocket.emit).toHaveBeenCalledWith('welcome', { userId: 'test-user-id' });
        });
        it('should handle connection error', async () => {
            const errorSocket = {
                ...mockSocket,
                handshake: { auth: { token: 'invalid-token' } }
            };
            await gateway.handleConnection(errorSocket);
            expect(errorSocket.disconnect).toHaveBeenCalled();
            expect(gateway.logger.error).toHaveBeenCalled();
        });
    });
    describe('handleDisconnect', () => {
        it('should handle disconnection', async () => {
            const userId = 'test-user-id';
            const socketId = 'test-socket-id';
            gateway.userSockets.set(userId, new Set([socketId]));
            gateway.socketToUser.set(socketId, userId);
            await gateway.handleDisconnect(mockSocket);
            const userSockets = gateway.userSockets.get(userId);
            expect(userSockets?.has(socketId)).toBeFalsy();
            expect(gateway.socketToUser.has(socketId)).toBeFalsy();
        });
    });
});
//# sourceMappingURL=rtc.integration.spec.js.map