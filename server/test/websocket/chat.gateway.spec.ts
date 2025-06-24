import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketGateway } from '@nestjs/websockets';
import { ChatGateway } from '../../src/modules/websocket/chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../src/modules/auth/auth.service';

// Mock AuthService
const mockAuthService: Partial<AuthService> = {
  verifyToken: jest.fn().mockResolvedValue({ sub: 'test-user' })
};

import { MockWebSocket } from '../__mocks__/ws'; // Reuse our mock

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let authService: AuthService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({ sub: 'test-user' }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should add client to clients map', () => {
      const mockClient = new MockWebSocket();
      gateway.handleConnection(mockClient as any);
      expect(gateway['clients'].has(mockClient as any)).toBe(true);
    });
  });

  describe('handleDisconnect', () => {
    it('should remove client from clients map', () => {
      const mockClient = new MockWebSocket();
      gateway['clients'].set(mockClient as any, mockClient as any);
      gateway.handleDisconnect(mockClient as any);
      expect(gateway['clients'].has(mockClient as any)).toBe(false);
    });
  });
});
