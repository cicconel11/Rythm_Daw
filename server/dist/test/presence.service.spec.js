"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const presence_service_1 = require("../src/modules/presence/presence.service");
describe('PresenceService', () => {
    let service;
    const mockDate = new Date('2023-01-01T00:00:00Z');
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(mockDate);
        service = new presence_service_1.PresenceService();
    });
    afterEach(() => {
        jest.useRealTimers();
        if (service['cleanupInterval']) {
            clearInterval(service['cleanupInterval']);
        }
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('updateUserPresence', () => {
        it('should update user last seen time', () => {
            const userId = 'user1';
            service.updateUserPresence(userId);
            expect(service['isOnline'](userId)).toBeTruthy();
        });
    });
    describe('removeUserPresence', () => {
        it('should remove user from presence tracking', () => {
            const userId = 'user1';
            service.updateUserPresence(userId);
            service.removeUserPresence(userId);
            expect(service['isOnline'](userId)).toBeFalsy();
        });
    });
    describe('isOnline', () => {
        it('should return false for unknown user', () => {
            expect(service['isOnline']('unknown')).toBeFalsy();
        });
        it('should return true for recently seen user', () => {
            const userId = 'user1';
            service.updateUserPresence(userId);
            expect(service['isOnline'](userId)).toBeTruthy();
        });
        it('should return false for user seen too long ago', () => {
            const userId = 'user1';
            service.updateUserPresence(userId);
            const thirtyOneSecondsLater = new Date(mockDate.getTime() + 31000);
            jest.setSystemTime(thirtyOneSecondsLater);
            expect(service['isOnline'](userId)).toBeFalsy();
        });
    });
    describe('cleanupDisconnectedUsers', () => {
        it('should remove users not seen recently', () => {
            const userId1 = 'user1';
            const userId2 = 'user2';
            service.updateUserPresence(userId1);
            const thirtyOneSecondsAgo = new Date(mockDate.getTime() - 31000);
            service['userPresence'].set(userId2, {
                userId: userId2,
                lastSeen: thirtyOneSecondsAgo
            });
            service['cleanupDisconnectedUsers']();
            expect(service['isOnline'](userId1)).toBeTruthy();
            expect(service['isOnline'](userId2)).toBeFalsy();
        });
    });
});
//# sourceMappingURL=presence.service.spec.js.map