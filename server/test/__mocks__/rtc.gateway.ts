export default {
  emitToUser: jest.fn().mockReturnValue(true),
  testServer: { to: jest.fn().mockReturnThis(), emit: jest.fn() },
};
