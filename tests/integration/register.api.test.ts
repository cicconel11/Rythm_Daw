import { NextRequest, NextResponse } from 'next/server';
import { POST as initHandler } from '@/app/api/auth/register/init/route';
import { POST as verifyHandler } from '@/app/api/auth/register/verify/route';
import { POST as completeHandler } from '@/app/api/auth/register/complete/route';
import store from '@/app/lib/store';
import bcrypt from 'bcryptjs';

// Mock the bcrypt.hash function
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

// Mock the store
jest.mock('@/app/lib/store', () => {
  const mockStore = {
    createPendingRegistration: jest.fn(),
    verifyPendingRegistration: jest.fn(),
    getPendingRegistrationByToken: jest.fn(),
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    invalidateToken: jest.fn(),
  };
  return mockStore;
});

// Mock the CSRF token validation
jest.mock('@/app/lib/security', () => ({
  withApiAuth: (handler: any) => handler,
  generateCsrfToken: () => ({ token: 'test-csrf-token' }),
}));

describe('Registration API Integration Tests', () => {
  const mockRequest = (body: any, headers: Record<string, string> = {}) => {
    return new NextRequest('http://localhost:3000/api/auth/register/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register/init', () => {
    it('should create a pending registration and return request ID', async () => {
      const mockRegistration = {
        id: 'test-request-id',
        email: 'test@example.com',
        code: '123456',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        attempts: 0,
        verified: false,
      };
      
      (store.createPendingRegistration as jest.Mock).mockReturnValue(mockRegistration);
      
      const req = mockRequest({ email: 'test@example.com' });
      const response = await initHandler(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.requestId).toBe('test-request-id');
      expect(store.createPendingRegistration).toHaveBeenCalledWith('test@example.com');
    });

    it('should return 409 for duplicate email', async () => {
      (store.getUserByEmail as jest.Mock).mockReturnValue({ email: 'test@example.com' });
      
      const req = mockRequest({ email: 'test@example.com' });
      const response = await initHandler(req);
      const data = await response.json();
      
      expect(response.status).toBe(409);
      expect(data.code).toBe('DUPLICATE_EMAIL');
    });
  });

  describe('POST /api/auth/register/verify', () => {
    it('should verify code and return token', async () => {
      const mockRegistration = {
        id: 'test-request-id',
        email: 'test@example.com',
        verified: true,
        token: 'test-token',
        tokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
      };
      
      (store.verifyPendingRegistration as jest.Mock).mockReturnValue({
        valid: true,
        registration: mockRegistration,
      });
      
      const req = mockRequest({
        email: 'test@example.com',
        requestId: 'test-request-id',
        code: '123456',
      });
      
      const response = await verifyHandler(req);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.token).toBe('test-token');
      expect(store.verifyPendingRegistration).toHaveBeenCalledWith('test@example.com', '123456');
    });

    it('should return 400 for invalid code', async () => {
      (store.verifyPendingRegistration as jest.Mock).mockReturnValue({
        valid: false,
      });
      
      const req = mockRequest({
        email: 'test@example.com',
        requestId: 'test-request-id',
        code: 'wrong-code',
      });
      
      const response = await verifyHandler(req);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.code).toBe('INVALID_CODE');
    });
  });

  describe('POST /api/auth/register/complete', () => {
    const mockRegistration = {
      id: 'test-request-id',
      email: 'test@example.com',
      verified: true,
      token: 'test-token',
      tokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      passwordHash: 'hashed-password',
      avatarUrl: 'https://example.com/avatar.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      (store.getPendingRegistrationByToken as jest.Mock).mockReturnValue(mockRegistration);
      (store.createUser as jest.Mock).mockReturnValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    });

    it('should complete registration and create user', async () => {
      const req = mockRequest({
        token: 'test-token',
        displayName: 'Test User',
        password: 'SecurePass123!',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      
      const response = await completeHandler(req);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data.userId).toBe('user-123');
      expect(store.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        displayName: 'Test User',
        passwordHash: 'hashed-password',
        avatarUrl: 'https://example.com/avatar.jpg',
      });
      expect(store.invalidateToken).toHaveBeenCalledWith('test-token');
    });

    it('should return 400 for invalid or expired token', async () => {
      (store.getPendingRegistrationByToken as jest.Mock).mockReturnValue(null);
      
      const req = mockRequest({
        token: 'invalid-token',
        displayName: 'Test User',
        password: 'SecurePass123!',
      });
      
      const response = await completeHandler(req);
      const data = await response.json();
      
      expect(response.status).toBe(400);
      expect(data.code).toBe('INVALID_TOKEN');
      expect(store.createUser).not.toHaveBeenCalled();
    });
  });
});
