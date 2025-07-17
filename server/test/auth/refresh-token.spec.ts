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
    signAsync: jest.fn().mockImplementation((payload: any, options: any) => {
      if (options && options.secret === 'test-access-secret') {
        return Promise.resolve('new-access-token');
      } else if (options && options.secret === 'test-refresh-secret') {
        return Promise.resolve('new-refresh-token');
      }
      return Promise.resolve('mocked-token');
    }),
    verify: jest.fn().mockImplementation((token: string, options: any) => {
      // For testing purposes, we'll accept any token that's not explicitly invalid
      if (token === 'invalid-refresh-token') {
        throw new Error('Invalid token');
      }
      
      // For test-refresh-token, return a valid payload
      if (token === 'test-refresh-token') {
        return { sub: 'test-user-id', email: 'test@example.com' };
      }
      
      // For non-existent-user-token, return a different user ID
      if (token === 'non-existent-user-token') {
        return { sub: 'non-existent-user-id', email: 'nonexistent@example.com' };
      }
      
      // Default case
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
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a new instance of AuthService with mocked dependencies
    authService = new AuthService(
      mockJwtService as any,
      mockPrismaService as any,
      mockConfigService as any
    );
    
    // Mock the getTokens method to return our mock tokens
    jest.spyOn(authService as any, 'getTokens').mockImplementation(async () => ({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User'
      }
    }));
    
    // Mock the updateRefreshToken method
    jest.spyOn(authService as any, 'updateRefreshToken').mockImplementation(async () => {
      // Update the mock user's refresh token
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        refreshToken: 'new-refresh-token'
      });
    });
    
    // Mock the config service to return the correct secrets
    (mockConfigService.get as jest.Mock).mockImplementation((key: string) => {
      const config: Record<string, string> = {
        'JWT_ACCESS_SECRET': 'test-access-secret',
        'JWT_REFRESH_SECRET': 'test-refresh-secret',
      };
      return config[key] || null;
    });
    
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
      
      // Update the mock user to have the same refresh token
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        ...mockUser,
        refreshToken: refreshToken, // Make sure this matches the token we're passing
      });
      
      // Mock the update method to return the updated user
      mockPrismaService.user.update.mockResolvedValueOnce({
        ...mockUser,
        refreshToken: 'new-refresh-token',
      });
      
      // Call the method
      const result = await authService.refreshTokens(userId, refreshToken);
      
      // Verify the result
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
        },
      });
      
      // Verify the service method was called with the correct arguments
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, expect.objectContaining({
        secret: 'test-refresh-secret',
      }));
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { refreshToken: 'new-refresh-token' },
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const userId = 'test-user-id';
      const refreshToken = 'invalid-refresh-token';
      
      // Call the method and expect an exception
      await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
      
      // Verify the service method was called with the correct arguments
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, expect.objectContaining({
        secret: 'test-refresh-secret',
      }));
    });

    it('should throw UnauthorizedException with generic message when user not found', async () => {
      const userId = 'non-existent-user-id';
      const refreshToken = 'non-existent-user-token';
      
      // Mock user not found
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      
      // Call the method and expect an exception
      await expect(authService.refreshTokens(userId, refreshToken)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token')
      );
      
      // Verify the service method was called with the correct arguments
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, expect.objectContaining({
        secret: 'test-refresh-secret',
      }));
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
