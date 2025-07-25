import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { prismaMock } from '../utils/auth-test-setup';
import * as bcrypt from 'bcrypt';

// Create a mock JWT service that implements the required methods
const createMockJwtService = (): jest.Mocked<JwtService> => {
  const mock = {
    sign: jest.fn().mockImplementation((payload: unknown, options?: unknown) => {
      if (options?.expiresIn === '15m') return 'mocked-access-token';
      if (options?.expiresIn === '7d') return 'mocked-refresh-token';
      return 'mocked-token';
    }),
    
    verify: jest.fn().mockImplementation((token: string, options: unknown) => ({
      sub: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    })),
    
    signAsync: jest.fn().mockImplementation((payload: unknown, options?: unknown) => {
      if (options?.expiresIn === '15m') return Promise.resolve('mocked-access-token');
      if (options?.expiresIn === '7d') return Promise.resolve('mocked-refresh-token');
      return Promise.resolve('mocked-token');
    }),
    
    verifyAsync: jest.fn().mockResolvedValue({
      sub: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    }),
    
    // Add other required methods with default mock implementations
    decode: jest.fn(),
    signSync: jest.fn().mockReturnValue('mocked-token'),
    verifySync: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    decodeSync: jest.fn().mockReturnValue({ sub: 'test-user-id' }),
    
    // Add any other methods that might be called
    mergeJwtOptions: jest.fn().mockReturnThis(),
    overrideSecretFromOptions: jest.fn().mockReturnThis(),
    getSecretKey: jest.fn().mockReturnValue('test-secret'),
    createToken: jest.fn().mockReturnValue({ token: 'mocked-token' })
  };
  
  return mock as unknown as jest.Mocked<JwtService>;
};

// Extend the NodeJS namespace to include our custom global types
declare global {
  namespace NodeJS {
    interface Global {
      prisma: typeof prismaMock;
    }
  }
}

const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  refreshToken: 'hashed-refresh-token',
  isApproved: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: unknown;
  let jwtService: jest.Mocked<JwtService>;
  let configService: unknown;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Mock console.error to prevent test output pollution
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create fresh mocks for each test
    jwtService = createMockJwtService();
    
    // Create a simple mock ConfigService
    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, any> = {
          'auth.accessToken.secret': 'test-secret',
          'auth.accessToken.expiresIn': '15m',
          'auth.refreshToken.secret': 'test-refresh-secret',
          'auth.refreshToken.expiresIn': '7d',
          'JWT_REFRESH_SECRET': 'test-refresh-secret',
        };
        return config[key];
      })
    };

    // Setup bcrypt mocks with proper typing
    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashed-password');
    (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);

    // Reset Prisma mock
    prisma = {
      ...prismaMock,
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
      }
    };

    // Setup Prisma mocks
    prisma.user.findUnique.mockImplementation(({ where }: unknown) => {
      if (where.id === 'test-user-id' || where.email === 'test@example.com') {
        return Promise.resolve({ ...TEST_USER, ...where });
      }
      return Promise.resolve(null);
    });
    
    prisma.user.create.mockResolvedValue(TEST_USER);
    prisma.user.update.mockImplementation(({ where, data }: unknown) => 
      Promise.resolve({ ...TEST_USER, ...data })
    );
    prisma.user.findFirst.mockResolvedValue(TEST_USER);

    // Initialize the service with mocks in the correct order
    service = new AuthService(
      jwtService,
      prisma,
      configService
    );
    
    // Mock bcrypt
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed-password'));
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
  });

  describe('refreshTokens', () => {
    it('should return new tokens with valid refresh token', async () => {
      // Arrange
      const userId = TEST_USER.id;
      const refreshToken = 'valid-refresh-token';
      
      // Mock user with matching refresh token
      const mockUser = {
        ...TEST_USER,
        id: userId,
        refreshToken,
      };
      
      // Mock Prisma and JWT service
      prisma.user.findUnique.mockResolvedValue(mockUser);
      
      // Mock JWT verify to return a valid payload
      jwtService.verify.mockImplementation((token, options) => ({
        sub: userId,
        email: TEST_USER.email,
        name: TEST_USER.name,
      }));
      
      // Mock the private getTokens method
      const getTokensSpy = jest.spyOn(service as any, 'getTokens');
      getTokensSpy.mockImplementation(async () => ({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: { 
          id: userId, 
          email: TEST_USER.email, 
          name: TEST_USER.name 
        }
      }));
      
      // Mock the user update
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        refreshToken: 'new-refresh-token',
      });

      // Act
      const result = await service.refreshTokens(userId, refreshToken);

      // Assert
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: userId,
          email: TEST_USER.email,
          name: TEST_USER.name,
        },
      });
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-refresh-secret',
      });
      
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refreshToken: 'new-refresh-token' },
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      // Arrange
      const userId = TEST_USER.id;
      const invalidToken = 'invalid-refresh-token';
      
      // Mock JWT verification to throw an error
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(
        service.refreshTokens(userId, invalidToken)
      ).rejects.toThrow(UnauthorizedException);
      
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      const refreshToken = 'valid-token';
      
      // Mock JWT verification to pass
      jwtService.verify.mockImplementation((token, options) => ({
        sub: userId,
        email: 'test@example.com',
        name: 'Test User'
      }));
      
      // Mock user not found
      prisma.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.refreshTokens(userId, refreshToken)
      ).rejects.toThrow(UnauthorizedException);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when refresh token does not match', async () => {
      // Arrange
      const userId = TEST_USER.id;
      const refreshToken = 'valid-refresh-token';
      
      // Mock user with different refresh token
      const mockUser = {
        ...TEST_USER,
        id: userId,
        refreshToken: 'different-refresh-token',
      };
      
      // Mock JWT verification to pass
      jwtService.verify.mockImplementation((token, options) => ({
        sub: userId,
        email: 'test@example.com',
        name: 'Test User'
      }));
      
      // Mock user found but with different token
      prisma.user.findUnique.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        service.refreshTokens(userId, refreshToken)
      ).rejects.toThrow(UnauthorizedException);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
