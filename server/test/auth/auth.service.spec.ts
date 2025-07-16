import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/modules/auth/auth.service';
import { buildAuthTestModuleImports, prismaMock } from '../utils/auth-test-setup';

const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed-password',
  isApproved: true,
  refreshToken: 'test-refresh-token',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let prisma: typeof prismaMock;
  let module: any;

  beforeEach(async () => {
    // Create the testing module with our test utilities
    module = await Test.createTestingModule({
      imports: buildAuthTestModuleImports(),
    })
    .overrideProvider('PrismaService')
    .useValue(prismaMock)
    .compile();

    // Get the service instances with type assertions
    service = module.get(AuthService);
    jwtService = module.get(JwtService);
    prisma = module.get('PrismaService') as typeof prismaMock;

    // Setup default mock implementations
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockImplementation(({ data }) => Promise.resolve({
      ...TEST_USER,
      ...data,
      name: data.name || data.email.split('@')[0],
    }));
    
    prisma.user.update.mockImplementation(({ where, data }) => 
      Promise.resolve({ ...TEST_USER, ...data })
    );
    
    prisma.user.findFirst.mockResolvedValue(TEST_USER);
    
    // Mock bcrypt with type assertions
    const bcrypt = require('bcrypt');
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed-password'));
    
    // Mock JWT methods with type assertions
    (jwtService.sign as jest.Mock).mockReturnValue('mocked-jwt-token');
    (jwtService.verify as jest.Mock).mockReturnValue({ sub: 'test-user-id' });
    (jwtService.signAsync as jest.Mock).mockResolvedValue('mocked-jwt-token');
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: 'test-user-id' });
    
    // Ensure all mocks are cleared before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('refreshTokens', () => {
    it('should return new tokens with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const hashedRefreshToken = await require('bcrypt').hash(refreshToken, 10);
      
      const mockUser = {
        ...TEST_USER,
        refreshToken: hashedRefreshToken,
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue({
        ...mockUser,
        refreshToken: 'new-refresh-token',
      });

      const result = await service.refreshTokens(TEST_USER.id, refreshToken);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: TEST_USER.id },
        data: { refreshToken: expect.any(String) },
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';
      
      const mockUser = {
        ...TEST_USER,
        refreshToken: 'different-hashed-token',
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.refreshTokens(TEST_USER.id, refreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 'non-existent-user-id';
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshTokens(userId, 'any-token')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if refresh token does not match', async () => {
      const refreshToken = 'valid-refresh-token';
      
      const mockUser = {
        ...TEST_USER,
        refreshToken: 'different-hashed-token',
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.refreshTokens(TEST_USER.id, refreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
