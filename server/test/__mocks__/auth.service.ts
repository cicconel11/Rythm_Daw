export const AuthService = {
  verifyToken: jest.fn().mockResolvedValue({ sub: 'test-user' })
};

export default AuthService;
