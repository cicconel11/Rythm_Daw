import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UnauthorizedException, HttpStatus } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtStrategy } from '../../src/modules/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../src/modules/auth/strategies/jwt-refresh.strategy';
import { JwtAuthGuard } from '../../src/modules/auth/guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../../src/modules/auth/guards/refresh-token.guard';
import { prismaMock, resetPrismaMocks } from '../utils/prisma-mock';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let prisma: jest.Mocked<PrismaService>;
  
  // Define test user data
  const TEST_USER = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    isApproved: true,
    refreshToken: 'test-refresh-token',
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  } as unknown as jest.Mocked<PrismaService>;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    resetPrismaMocks();
    
    // Create config service first
    configService = new ConfigService({
      JWT_SECRET: 'test-access-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_ACCESS_EXPIRATION: '15m',
      JWT_REFRESH_EXPIRATION: '7d',
    });

    // Create JWT service with test secret
    jwtService = new JwtService({
      secret: 'test-jwt-secret',
      signOptions: { expiresIn: '15m' },
    });

    // Reset mock implementations
    mockPrisma.user.findUnique.mockReset();
    mockPrisma.user.update.mockReset();
    mockPrisma.user.create.mockImplementation(({ data }: { data: unknown }) => Promise.resolve({
      ...TEST_USER,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      password: data.password,
    }));
    mockPrisma.user.findFirst.mockReset();
    
    // Setup default mock implementations
    mockPrisma.user.findUnique.mockResolvedValue(TEST_USER);
    mockPrisma.user.update.mockResolvedValue({
      ...TEST_USER,
      refreshToken: 'new-refresh-token',
    });

    // Mock JWT methods
    const mockVerify = jest.spyOn(jwtService, 'verify').mockImplementation((token: string, options: unknown) => {
      if (options.secret === 'test-refresh-secret' || options.secret === 'test-access-secret') {
        return { sub: 'test-user-id', email: TEST_USER.email, name: TEST_USER.name };
      }
      throw new Error('Invalid token');
    });
    
    jest.spyOn(jwtService, 'sign').mockImplementation(() => 'test-token');
    jest.spyOn(jwtService, 'signAsync').mockImplementation((payload: unknown, options: unknown) => {
      if (options.secret === 'test-refresh-secret') {
        return Promise.resolve('test-refresh-token');
      }
      return Promise.resolve('test-access-token');
    });
    
    jest.spyOn(jwtService, 'verifyAsync').mockImplementation(() => 
      Promise.resolve({ sub: 'test-user-id', email: TEST_USER.email, name: TEST_USER.name })
    );

    // Mock bcrypt
    jest.spyOn(require('bcrypt'), 'compare').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(require('bcrypt'), 'hash').mockImplementation(() => Promise.resolve('hashed-password'));

    // Create auth service with mocked dependencies
    authService = new AuthService(jwtService, mockPrisma, configService);
    
    // Mock the getTokens method
    jest.spyOn(authService as any, 'getTokens').mockImplementation(async (userId: string, email: string, name: string) => ({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      user: { id: userId, email, name }
    }));
    
    // Make prisma available for test assertions
    prisma = mockPrisma;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshTokens', () => {
    it('should return new tokens with valid refresh token', async () => {
      // Arrange
      const userId = 'test-user-id';
      const refreshToken = 'valid-refresh-token';
      
      // Mock the config service to return test secrets
      const configSpy = jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        if (key === 'JWT_SECRET') return 'test-access-secret';
        return null;
      });
      
      // Mock the JWT verification to return a valid payload
      const mockVerify = jest.spyOn(jwtService, 'verify').mockImplementation((token: string, options: unknown) => {
        if (options.secret !== 'test-refresh-secret') {
          throw new Error('Invalid token');
        }
        return {
          sub: userId,
          email: TEST_USER.email,
          name: TEST_USER.name,
        };
      });
      
      // Mock the getTokens method to return test tokens
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: userId,
          email: TEST_USER.email,
          name: TEST_USER.name
        }
      };
      
      // Mock the getTokens method on the instance
      const getTokensSpy = jest.spyOn(authService as any, 'getTokens').mockResolvedValue(mockTokens);
      
      // Mock the user lookup to return a user with the refresh token
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...TEST_USER,
        id: userId,
        refreshToken, // Ensure the refresh token matches
      });
      
      // Mock the user update
      mockPrisma.user.update.mockResolvedValueOnce({
        ...TEST_USER,
        id: userId,
        refreshToken: mockTokens.refreshToken,
      });

      // Act
      const result = await authService.refreshTokens(userId, refreshToken);

      // Assert
      expect(configSpy).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
      expect(mockVerify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-refresh-secret',
      });
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(getTokensSpy).toHaveBeenCalledWith(
        userId,
        TEST_USER.email,
        TEST_USER.name
      );
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refreshToken: mockTokens.refreshToken },
      });
      expect(result).toEqual(mockTokens);
      
      // Clean up
      configSpy.mockRestore();
      mockVerify.mockRestore();
      getTokensSpy.mockRestore();
    });

    it('should throw UnauthorizedException if refresh token is missing', async () => {
      // Act & Assert
      await expect(authService.refreshTokens('test-user-id', '')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const userId = 'non-existent-user-id';
      const refreshToken = 'valid-refresh-token';
      
      // Mock the config service
      const configSpy = jest.spyOn(configService, 'get').mockReturnValue('test-secret');
      
      // Mock the JWT verification to succeed
      const mockVerify = jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: userId });
      
      // Mock the user lookup to return null
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      
      // Act & Assert
      await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(UnauthorizedException);
      
      // Clean up
      configSpy.mockRestore();
      mockVerify.mockRestore();
    });
    
    it('should throw UnauthorizedException if refresh token does not match', async () => {
      // Arrange
      const userId = 'test-user-id';
      const refreshToken = 'invalid-refresh-token';
      
      // Mock the config service
      const configSpy = jest.spyOn(configService, 'get').mockReturnValue('test-secret');
      
      // Mock the JWT verification to succeed
      const mockVerify = jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: userId });
      
      // Mock the user lookup to return a user with a different refresh token
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...TEST_USER,
        id: userId,
        refreshToken: 'different-refresh-token',
      });
      
      // Act & Assert
      await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(UnauthorizedException);
      
      // Clean up
      configSpy.mockRestore();
      mockVerify.mockRestore();
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      // Arrange
      const userId = 'test-user-id';
      const invalidToken = 'invalid-refresh-token';
      
      // Mock JWT verification to throw an error
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(
        authService.refreshTokens(userId, invalidToken)
      ).rejects.toThrow(UnauthorizedException);
      
      expect(jwtService.verify).toHaveBeenCalledWith(invalidToken, {
        secret: expect.any(String),
      });
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.user.update).not.toHaveBeenCalled();
    });
  });
});
