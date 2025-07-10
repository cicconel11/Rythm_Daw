"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chat_gateway_1 = require("../src/modules/chat/chat.gateway");
const mockPresenceService = {
    updateUserPresence: jest.fn(),
    removeUserPresence: jest.fn(),
    isOnline: jest.fn(() => true),
};
const mockRtcGateway = {
    registerWsServer: jest.fn(),
};
describe('ChatGateway', () => {
    let gateway;
    beforeEach(() => {
        gateway = new chat_gateway_1.ChatGateway(mockPresenceService, mockRtcGateway);
        gateway['server'] = {
            emit: jest.fn(),
            to: jest.fn().mockReturnThis(),
        };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
    describe('handleConnection', () => {
        it('should update user presence when a user connects', () => {
            const client = {
                id: 'test-client-id',
                data: { user: { userId: 'test-user-id' } },
                join: jest.fn(),
            };
            gateway.handleConnection(client);
            expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith('test-user-id');
            expect(gateway['server'].emit).toHaveBeenCalledWith('userOnline', { userId: 'test-user-id' });
        });
    });
    describe('handleDisconnect', () => {
        it('should notify when a user disconnects', () => {
            const client = {
                id: 'test-client-id',
                data: { user: { userId: 'test-user-id' } },
                rooms: new Set(['room1', 'room2']),
            };
            gateway.handleDisconnect(client);
            expect(gateway['server'].emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user-id' });
        });
    });
    describe('handleMessage', () => {
        it('should broadcast message to room', () => {
            const client = {
                id: 'test-client-id',
                data: { user: { userId: 'test-user-id', username: 'test-user' } },
                join: jest.fn(),
            };
            const message = {
                to: 'test-room',
                content: 'Hello, world!',
            };
            gateway.handleMessage(client, message);
            expect(gateway['server'].to).toHaveBeenCalledWith('test-room');
            expect(gateway['server'].emit).toHaveBeenCalledWith('message', {
                from: 'test-user-id',
                to: 'test-room',
                content: 'Hello, world!',
                timestamp: expect.any(String),
            });
        });
    });
    describe('handleTyping', () => {
        it('should broadcast typing status', () => {
            const client = {
                id: 'test-client-id',
                data: { user: { userId: 'test-user-id', username: 'test-user' } },
            };
            const typingData = {
                to: 'test-room',
                isTyping: true,
            };
            gateway.handleTyping(client, typingData);
            expect(gateway['server'].to).toHaveBeenCalledWith('test-room');
            expect(gateway['server'].emit).toHaveBeenCalledWith('typing', {
                from: 'test-user-id',
                isTyping: true,
            });
        });
    });
});
//# sourceMappingURL=chat.gateway.fixed.spec.js.map