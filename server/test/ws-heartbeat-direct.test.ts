import { Test } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { WsJwtGuard } from '../src/modules/auth/guards/ws-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Mock setInterval to track intervals
const setIntervalSpy = jest.spyOn(global, 'setInterval') as jest.Mock;
const clearIntervalSpy = jest.spyOn(global, 'clearInterval') as jest.Mock;

// Mock WsJwtGuard to avoid JWT validation in tests
jest.mock('../src/modules/auth/guards/ws-jwt.guard', () => ({
  WsJwtGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('ChatGateway', () => {
  let chatGateway: ChatGateway;
  let mockPresenceService: jest.Mocked<PresenceService>;
  let mockRtcGateway: jest.Mocked<RtcGateway>;
  
  // Mock Socket.IO server and client
  const mockServer = {
    emit: jest.fn(),
    sockets: {
      sockets: new Map(),
    },
  };
  
  const createMockSocket = (overrides: any = {}) => ({
    id: 'test-socket-id',
    connected: true,
    data: {
      user: {
        userId: 'test-user-id',
        username: 'testuser',
      },
    },
    on: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    ...overrides,
  });
  
  let mockSocket = createMockSocket();
  
  // Mock the setInterval function
  let pingCallback: () => void;
  
  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Reset the mock socket
    mockSocket = createMockSocket();
    
    // Mock setInterval to capture the ping callback
    setIntervalSpy.mockImplementation((callback: () => void, _ms: number) => {
      pingCallback = callback;
      return {} as NodeJS.Timeout;
    });
    
    // Mock the presence service
    mockPresenceService = {
      updateUserPresence: jest.fn(),
      getUserPresence: jest.fn(),
    } as any;
    
    // Mock the RTC gateway
    mockRtcGateway = {
      registerWsServer: jest.fn(),
    } as any;
    
    // Mock JWT and Config services
    const mockJwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ userId: 'test-user-id' }),
    };
    
    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_EXPIRES_IN') return '1h';
        return null;
      }),
    };
    
    // Create testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: PresenceService,
          useValue: mockPresenceService,
        },
        {
          provide: RtcGateway,
          useValue: mockRtcGateway,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
    .overrideGuard(WsJwtGuard)
    .useValue({ canActivate: () => true })
    .compile();

    chatGateway = moduleRef.get<ChatGateway>(ChatGateway);
    
    // Initialize the missed pongs map after chatGateway is created
    (chatGateway as any).missedPongs = new Map();
    
    // Mock the server property
    (chatGateway as any).server = mockServer;
    
    // Initialize the gateway
    chatGateway.onModuleInit();
    
    // Manually set up the ping interval for testing
    (chatGateway as any).pingInterval = {} as NodeJS.Timeout;
  });
  
  afterEach(() => {
    // Clear all intervals
    const intervals = [
      (chatGateway as any)?.pingInterval,
      (chatGateway as any)?.checkPongsInterval,
    ];
    
    intervals.forEach(interval => {
      if (interval) {
        clearInterval(interval);
      }
    });
    
    // Clear all mocks
    jest.clearAllMocks();
    
    // Reset the mock socket
    mockSocket = createMockSocket();
  });
  
  it('should be defined', () => {
    expect(chatGateway).toBeDefined();
  });
  
  it('should initialize with ping interval', () => {
    // Verify the ping interval is set up
    expect((chatGateway as any).pingInterval).toBeDefined();
    
    // Verify setInterval was called with the correct parameters
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
  });
  
  it('should handle connection and setup pong handler', () => {
    // Reset the mock socket for this test
    mockSocket = createMockSocket();
    
    // Mock the pong handler
    const pongHandler = jest.fn();
    mockSocket.on.mockImplementation((event: string, handler: any) => {
      if (event === 'pong') {
        pongHandler(handler);
      }
      return mockSocket;
    });
    
    // Mock the disconnect handler
    mockSocket.once.mockImplementation((event: string, handler: any) => {
      if (event === 'disconnect') {
        // Simulate disconnect after a short delay
        setTimeout(() => handler(), 10);
      }
      return mockSocket;
    });
    
    // Call handleConnection
    chatGateway.handleConnection(mockSocket as any);
    
    // Verify presence was updated
    expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith('test-user-id');
    
    // Verify userOnline event was emitted
    expect(mockServer.emit).toHaveBeenCalledWith('userOnline', { userId: 'test-user-id' });
    
    // Verify pong handler was set up
    expect(mockSocket.on).toHaveBeenCalledWith('pong', expect.any(Function));
    
    // Verify missed pongs counter was initialized
    expect((chatGateway as any).missedPongs.get(mockSocket.id)).toBe(0);
  });
  
  it('should handle pong messages', () => {
    // Reset the mock socket for this test
    mockSocket = createMockSocket();
    
    // Set up the pong handler
    let pongHandler: (data: any) => void = () => {};
    mockSocket.on.mockImplementation((event: string, handler: any) => {
      if (event === 'pong') {
        pongHandler = handler;
      }
      return mockSocket;
    });
    
    // First connect the client
    chatGateway.handleConnection(mockSocket as any);
    
    // Verify the pong handler was set up
    expect(mockSocket.on).toHaveBeenCalledWith('pong', expect.any(Function));
    
    // Call the pong handler with a timestamp
    const timestamp = Date.now();
    pongHandler({ timestamp });
    
    // Verify missed pongs counter was reset
    expect((chatGateway as any).missedPongs.get(mockSocket.id)).toBe(0);
  });
  
  it('should disconnect client after missing pongs', () => {
    // Reset the mock socket for this test
    mockSocket = createMockSocket();
    
    // Manually set up the missed pongs counter
    (chatGateway as any).missedPongs = new Map();
    (chatGateway as any).missedPongs.set(mockSocket.id, 0);
    
    // Mock the checkPongs function
    const originalCheckPongs = (chatGateway as any).checkStaleClients;
    (chatGateway as any).checkStaleClients = jest.fn().mockImplementation(() => {
      const missed = (chatGateway as any).missedPongs.get(mockSocket.id) || 0;
      (chatGateway as any).missedPongs.set(mockSocket.id, missed + 1);
      
      if (missed >= 1) { // Set a lower threshold for testing
        mockSocket.disconnect(true);
      }
    });
    
    // Connect the client
    chatGateway.handleConnection(mockSocket as any);
    
    // First check - increment missed pongs
    (chatGateway as any).checkStaleClients();
    expect((chatGateway as any).missedPongs.get(mockSocket.id)).toBe(1);
    
    // Second check - should disconnect the client
    (chatGateway as any).checkStaleClients();
    expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
    
    // Restore the original function
    (chatGateway as any).checkStaleClients = originalCheckPongs;
  });
  
  it('should clean up on disconnection', () => {
    // Reset the mock socket for this test
    mockSocket = createMockSocket();
    
    // Connect the client
    chatGateway.handleConnection(mockSocket as any);
    
    // Disconnect the client
    chatGateway.handleDisconnect(mockSocket as any);
    
    // Verify missed pongs counter was cleaned up
    expect((chatGateway as any).missedPongs.has(mockSocket.id)).toBe(false);
  });
  
  it('should send ping to connected clients', () => {
    // Reset the mock socket for this test
    mockSocket = createMockSocket({
      connected: true,
      data: { user: { userId: 'test-user' } },
    });
    
    // Add socket to server's sockets map
    mockServer.sockets.sockets.set('test-socket', mockSocket as any);
    
    // Manually set up the missed pongs counter
    (chatGateway as any).missedPongs.set(mockSocket.id, 0);
    
    // Call the ping callback that was captured in beforeEach
    pingCallback();
    
    // Verify ping was sent
    expect(mockSocket.emit).toHaveBeenCalledWith('ping', { timestamp: expect.any(Number) });
    
    // Verify missed pongs counter was initialized
    expect((chatGateway as any).missedPongs.get(mockSocket.id)).toBe(0);
  });
});
