import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../src/modules/auth/auth.controller';
import { AuthService } from '../../src/modules/auth/auth.service';
import { createMockResponse, type MockResponse } from '../unit/__mocks__/express.mock';

const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  refreshToken: 'test-refresh-token'
};

// Mock the response object
const mockResponse = (): MockResponse => {
  const res = createMockResponse();
  res.cookie = jest.fn();
  res.clearCookie = jest.fn();
  return res;
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let res: MockResponse;

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
      const result = await controller.refreshToken(req as unknown as { user: { sub: string }; cookies: { refreshToken: string } }, { cookie: jest.fn() } as unknown as { cookie: (name: string, value: string, options?: any) => void });

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
      await expect(controller.refreshToken(req as unknown as { user: { sub: string }; cookies: {} }, res as unknown as MockResponse))
        .rejects
        .toThrow('Refresh token is required');
    });
  });
});
