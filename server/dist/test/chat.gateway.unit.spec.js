"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chat_gateway_1 = require("../src/modules/chat/chat.gateway");
const mockPresenceService = {
    updateUserPresence: jest.fn(),
    removeUserPresence: jest.fn(),
    isOnline: jest.fn(),
};
const mockRtcGateway = {
    registerWsServer: jest.fn(),
};
describe('ChatGateway (Unit)', () => {
    let gateway;
    let mockServer;
    beforeEach(() => {
        gateway = new chat_gateway_1.ChatGateway(mockPresenceService, mockRtcGateway);
        mockServer = {
            emit: jest.fn(),
            to: jest.fn().mockReturnThis(),
        };
        gateway.server = mockServer;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('handleConnection', () => {
        it('should update user presence when a user connects', async () => {
            const mockSocket = {
                data: {
                    user: {
                        userId: 'test-user',
                    },
                },
            };
            await gateway.handleConnection(mockSocket);
            expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith('test-user');
            expect(mockServer.emit).toHaveBeenCalledWith('userOnline', { userId: 'test-user' });
        });
    });
    describe('handleDisconnect', () => {
        it('should notify when a user disconnects', async () => {
            const mockSocket = {
                data: {
                    user: {
                        userId: 'test-user',
                    },
                },
            };
            await gateway.handleDisconnect(mockSocket);
            expect(mockServer.emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user' });
        });
    });
    describe('handleMessage', () => {
        it('should broadcast message to room', async () => {
            const mockSocket = {
                data: {
                    user: {
                        userId: 'test-user',
                    },
                },
            };
            const messageData = {
                to: 'room:test-room',
                content: 'Hello, world!',
            };
            const result = await gateway.handleMessage(mockSocket, messageData);
            expect(result).toEqual(expect.objectContaining({
                from: 'test-user',
                to: 'room:test-room',
                content: 'Hello, world!',
                timestamp: expect.any(String),
            }));
            expect(mockServer.to).toHaveBeenCalledWith('room:test-room');
            expect(mockServer.emit).toHaveBeenCalledWith('message', expect.any(Object));
        });
    });
    describe('handleTyping', () => {
        it('should broadcast typing status', () => {
            const mockSocket = {
                data: {
                    user: {
                        userId: 'test-user',
                    },
                },
            };
            const typingData = {
                to: 'room:test-room',
                isTyping: true,
            };
            gateway.handleTyping(mockSocket, typingData);
            expect(mockServer.to).toHaveBeenCalledWith('room:test-room');
            expect(mockServer.emit).toHaveBeenCalledWith('typing', {
                from: 'test-user',
                isTyping: true,
            });
        });
    });
});
//# sourceMappingURL=chat.gateway.unit.spec.js.map