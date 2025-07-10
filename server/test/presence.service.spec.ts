import { PresenceService } from '../src/modules/presence/presence.service';

describe('PresenceService', () => {
  let service: PresenceService;
  const mockDate = new Date('2023-01-01T00:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    service = new PresenceService();
  });

  afterEach(() => {
    jest.useRealTimers();
    // Clean up any intervals to avoid memory leaks
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
      
      // Fast-forward time to 31 seconds later
      const thirtyOneSecondsLater = new Date(mockDate.getTime() + 31000);
      jest.setSystemTime(thirtyOneSecondsLater);
      
      expect(service['isOnline'](userId)).toBeFalsy();
    });
  });

  describe('cleanupDisconnectedUsers', () => {
    it('should remove users not seen recently', () => {
      const userId1 = 'user1';
      const userId2 = 'user2';
      
      // User 1 was just active
      service.updateUserPresence(userId1);
      
      // User 2 was active 31 seconds ago
      const thirtyOneSecondsAgo = new Date(mockDate.getTime() - 31000);
      // Manually set the lastSeen time for user2
      service['userPresence'].set(userId2, {
        userId: userId2,
        lastSeen: thirtyOneSecondsAgo
      });
      
      // Trigger cleanup
      service['cleanupDisconnectedUsers']();
      
      expect(service['isOnline'](userId1)).toBeTruthy();
      expect(service['isOnline'](userId2)).toBeFalsy();
    });
  });
});
