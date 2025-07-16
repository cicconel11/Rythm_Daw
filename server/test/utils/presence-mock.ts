export const presenceServiceMock = {
  updateUserPresence: jest.fn().mockResolvedValue(undefined),
  removeUserPresence: jest.fn().mockResolvedValue(undefined),
  userConnected: jest.fn().mockResolvedValue(undefined),
  userDisconnected: jest.fn().mockResolvedValue(undefined),
  isOnline: jest.fn().mockResolvedValue(true),
  getOnlineUsers: jest.fn().mockResolvedValue([])
};
