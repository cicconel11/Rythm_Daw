import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { Response } from 'express';

const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  refreshToken: 'test-refresh-token'
};

// Mock the response object
const mockResponse = () => ({
  cookie: jest.fn(),
  clearCookie: jest.fn(),
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
} as unknown as Response);

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let res: ReturnType<typeof mockResponse>;

  // Create a mock auth service with all required methods
  const createMockAuthService = (): jest.Mocked<AuthService> => ({
    login: jest.fn(),
    signup: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    setRefreshTokenCookie: jest.fn(),
    clearRefreshTokenCookie: jest.fn(),
    validateUser: jest.fn(),
    verifyToken: jest.fn(),
    getUserById: jest.fn(),
  } as unknown as jest.Mocked<AuthService>);

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create mock service
    authService = createMockAuthService();
    
    // Manually create the controller with the mock service
    controller = new AuthController(authService);
    
    // Create mock response
    res = mockResponse();
    
    // Setup default mocks
    authService.refreshTokens.mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name,
      },
    });
  });

  res = mockResponse();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('refreshToken', () => {
    it('should return new access token with valid refresh token', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const req = {
        user: { sub: TEST_USER.id },
        cookies: { refreshToken },
      };

      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: TEST_USER.id,
          email: TEST_USER.email,
          name: TEST_USER.name,
        },
      };

      // Mock the refreshTokens method
      authService.refreshTokens.mockResolvedValue(tokens);

      // Mock setRefreshTokenCookie to do nothing
      authService.setRefreshTokenCookie.mockImplementation(() => {});

      // Act - Call the controller method directly
      const result = await controller.refreshToken(req as any, { cookie: jest.fn() } as any);

      // Assert
      expect(authService.refreshTokens).toHaveBeenCalledWith(
        TEST_USER.id,
        refreshToken,
      );
      expect(authService.setRefreshTokenCookie).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: tokens.accessToken,
        user: {
          id: TEST_USER.id,
          email: TEST_USER.email,
          name: TEST_USER.name,
        },
      });
    });

    it('should throw HttpException if refresh token is missing', async () => {
      // Arrange
      const req = {
        user: { sub: TEST_USER.id },
        cookies: {}, // No refresh token
      };

      // Act & Assert
      await expect(controller.refreshToken(req as any, res as any))
        .rejects
        .toThrow('Refresh token is required');
    });
  });
});
