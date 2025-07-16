import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  // Mock user data
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    refreshToken: 'test-refresh-token',
  };

  // Mock tokens
  const mockTokens = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
  };

  // Mock implementations
  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config: Record<string, string> = {
        'JWT_ACCESS_SECRET': 'test-access-secret',
        'JWT_REFRESH_SECRET': 'test-refresh-secret',
      };
      return config[key] || null;
    }),
  };
  
  // Mock bcrypt.compare to always return true for valid tokens
  (bcrypt.compare as jest.Mock).mockImplementation((token: string, hashedToken: string) => {
    return Promise.resolve(token === hashedToken);
  });

  // Create a mock JWT service with proper typing
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-token'),
    verify: jest.fn().mockImplementation((token: string, options: any) => {
      if (token === 'test-refresh-token') {
        if (options?.secret === 'test-refresh-secret') {
          return { sub: 'test-user-id', email: 'test@example.com' };
        }
        throw new Error('Invalid secret');
      } else if (token === 'non-existent-user-token') {
        if (options?.secret === 'test-refresh-secret') {
          return { sub: 'non-existent-user-id', email: 'nonexistent@example.com' };
        }
        throw new Error('Invalid secret');
      }
      throw new Error('Invalid token');
    }),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn().mockResolvedValue({
        ...mockUser,
        refreshToken: 'test-refresh-token',
      }),
      update: jest.fn().mockImplementation((args: any) => {
        return Promise.resolve({
          ...mockUser,
          refreshToken: args.data.refreshToken || 'new-refresh-token',
        });
      }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };

  beforeEach(async () => {
    // Create a new instance of AuthService with mocked dependencies
    authService = new AuthService(
      mockJwtService as any,
      mockPrismaService as any,
      mockConfigService as any
    );

    // Mock the getTokens method
    jest.spyOn(authService as any, 'getTokens').mockResolvedValue(mockTokens);
    
    // Mock the updateRefreshToken method
    jest.spyOn(authService as any, 'updateRefreshToken').mockResolvedValue(undefined);
    
    // Assign mocks to the variables for test assertions
    jwtService = mockJwtService as any;
    configService = mockConfigService as any;
    prismaService = mockPrismaService as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('refreshTokens', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const userId = 'test-user-id';
      const refreshToken = 'test-refresh-token';
      
      // Mock the getTokens method to return our mock tokens
      jest.spyOn(authService as any, 'getTokens').mockResolvedValueOnce({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: userId,
          email: 'test@example.com',
          name: 'Test User'
        }
      });
      
      const result = await authService.refreshTokens(userId, refreshToken);
      
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: userId,
          email: 'test@example.com',
          name: 'Test User'
        }
      });
      
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-refresh-secret',
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refreshToken: 'new-refresh-token' },
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const userId = 'test-user-id';
      const refreshToken = 'invalid-refresh-token';
      
      // Mock JWT verify to throw an error for invalid token
      (jwtService.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
      
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-refresh-secret',
      });
    });

    it('should throw UnauthorizedException with generic message when user not found', async () => {
      const userId = 'non-existent-user-id';
      const refreshToken = 'non-existent-user-token';
      
      // Mock user not found
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      // The service wraps all errors in a generic 'Invalid refresh token' message
      await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
      
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-refresh-secret',
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw UnauthorizedException with generic message when refresh token does not match', async () => {
      const userId = 'test-user-id';
      const wrongToken = 'wrong-refresh-token';
      
      // Mock JWT verify to succeed
      (jwtService.verify as jest.Mock).mockReturnValueOnce({ sub: userId });
      
      // Mock user with different refresh token
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        refreshToken: 'different-refresh-token',
      });

      // The service wraps all errors in a generic 'Invalid refresh token' message
      await expect(authService.refreshTokens(userId, wrongToken)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
    });
  });
});
