import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { WsJwtGuard } from '../src/modules/auth/guards/ws-jwt.guard';
import { Server, Socket, Namespace } from 'socket.io';
import { MockIoServer } from './__mocks__/socket-io';
import { attachMockServer } from './utils/gateway';

type MockSocket = {
  id: string;
  data: any;
  connected: boolean;
  disconnected: boolean;
  rooms: Set<string>;
  handshake: any;
  nsp: any;
  client: any;
  on: jest.Mock;
  once: jest.Mock;
  emit: jest.Mock;
  disconnect: jest.Mock;
  join: jest.Mock;
  leave: jest.Mock;
  to: jest.Mock;
  in: jest.Mock;
  listeners: jest.Mock;
  removeListener: jest.Mock;
  removeAllListeners: jest.Mock;
  broadcast: {
    to: jest.Mock;
    emit: jest.Mock;
  };
  use: jest.Mock;
  compress: jest.Mock;
  timeout: jest.Mock;
  send: jest.Mock;
};

type PongHandler = (data: { timestamp: number }) => void;
type DisconnectHandler = () => void;

// Mock global timers
let setIntervalSpy: jest.SpyInstance;
let clearIntervalSpy: jest.SpyInstance;

// Track intervals and callbacks
let pingIntervalCallback: (() => void) | undefined;
let checkIntervalCallback: (() => void) | undefined;
const pongHandlers = new Map<string, PongHandler>();
const disconnectHandlers = new Map<string, DisconnectHandler>();
const activeIntervals: Set<NodeJS.Timeout> = new Set();

// Mock implementation for setInterval that tracks callbacks
const createMockInterval = (callback: () => void, ms: number): NodeJS.Timeout => {
  const mockInterval = {
    [Symbol.toPrimitive]() { return ''; },
    hasRef: () => true,
    refresh: () => {},
    unref: () => {},
    ref: () => {},
    _callback: callback,
    _ms: ms
  } as unknown as NodeJS.Timeout;
  
  if (ms === 30000) { // Ping interval (30 seconds)
    pingIntervalCallback = callback;
  } else if (ms === 35000) { // Check interval (35 seconds)
    checkIntervalCallback = callback;
  }
  
  activeIntervals.add(mockInterval);
  return mockInterval;
};

describe('ChatGateway Heartbeat (Unit)', () => {
  let gateway: ChatGateway;
  let mockServer: any;
  let mockSocket: any;
  let mockPresenceService: any;
  let mockRtcGateway: any;
  
  // Mock functions for tracking intervals
  let setIntervalSpy: jest.SpyInstance;
  let clearIntervalSpy: jest.SpyInstance;
  
  // Track intervals
  const intervals = new Map<number, () => void>();
  let intervalId = 0;

  // Setup before each test
  beforeEach(async () => {
    // Reset intervals
    intervals.clear();
    intervalId = 0;
    
    // Create a mock server
    mockServer = new MockIoServer();

    // Mock PresenceService
    mockPresenceService = {
      updateUserPresence: jest.fn(),
      removeUserPresence: jest.fn(),
      getUserPresence: jest.fn()
    };

    // Mock RtcGateway
    mockRtcGateway = {
      emitToUser: jest.fn(),
      registerWsServer: jest.fn()
    };

    // Mock JwtService
    const mockJwtService = {
      verifyAsync: jest.fn().mockResolvedValue({ sub: 'test-user-1', username: 'testuser' })
    };

    // Mock ConfigService
    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-secret')
    };

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: PresenceService, useValue: mockPresenceService },
        { provide: RtcGateway, useValue: mockRtcGateway },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    })
      .overrideGuard(WsJwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    // Get gateway instance
    gateway = module.get<ChatGateway>(ChatGateway);
    attachMockServer(gateway, mockServer as unknown as Server);

    // Mock setInterval and clearInterval
    setIntervalSpy = jest.spyOn(global, 'setInterval').mockImplementation((callback: any) => {
      const id = ++intervalId;
      intervals.set(id, callback);
      return id as unknown as NodeJS.Timeout;
    });

    clearIntervalSpy = jest.spyOn(global, 'clearInterval').mockImplementation((id: any) => {
      intervals.delete(id as number);
    });

    // Create a mock socket implementation
    const mockSocketImpl: any = {
      id: 'test-socket-1',
      data: {
        user: {
          userId: 'test-user-1',
          username: 'testuser'
        }
      },
      connected: true,
      disconnected: false,
      rooms: new Set(),
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    
    // Add all socket methods
    mockSocketImpl.disconnect = jest.fn().mockImplementation(function(this: any) {
      this.connected = false;
      this.disconnected = true;
      return this;
    });
    mockSocketImpl.emit = jest.fn().mockImplementation((event: string, data: any) => {
      // For ping events, simulate pong response after a short delay
      if (event === 'ping') {
        process.nextTick(() => {
          const pongHandler = pongHandlers.get('test-socket-1');
          if (pongHandler) {
            pongHandler({ timestamp: data.timestamp });
          }
        });
      }
      return mockSocketImpl;
    });
    mockSocketImpl.on = jest.fn((event: string, callback: any) => {
      if (event === 'pong') {
        pongHandlers.set('test-socket-1', callback);
      } else if (event === 'disconnect') {
        disconnectHandlers.set('test-socket-1', callback);
      }
      return mockSocketImpl;
    });
    // Set up all mock methods
    mockSocketImpl.once = jest.fn().mockImplementation((event: string, callback: any) => {
      return mockSocketImpl.on?.(event, callback) || mockSocketImpl;
    });
    
    mockSocketImpl.listeners = jest.fn(() => []);
    mockSocketImpl.join = jest.fn().mockImplementation(() => mockSocketImpl);
    mockSocketImpl.leave = jest.fn();
    mockSocketImpl.to = jest.fn().mockReturnThis();
    mockSocketImpl.in = jest.fn().mockReturnThis();
    
    // Set up broadcast mock
    const broadcastMock = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };
    mockSocketImpl.broadcast = broadcastMock;
    
    // Set up handshake mock
    mockSocketImpl.handshake = {};
    
    // Set up namespace mock
    mockSocketImpl.nsp = {
      name: '/',
      sockets: new Map()
    };
    
    // Set up client mock
    mockSocketImpl.client = {
      conn: {
        remoteAddress: '127.0.0.1'
      }
    };
    
    // Set up remaining mock methods
    mockSocketImpl.use = jest.fn();
    mockSocketImpl.compress = jest.fn().mockReturnThis();
    mockSocketImpl.timeout = jest.fn();
    mockSocketImpl.send = jest.fn();
    mockSocketImpl.removeListener = jest.fn();
    mockSocketImpl.removeAllListeners = jest.fn();
    
    // Add mock socket to server's sockets map
    mockServer.sockets.sockets.set('test-socket-1', mockSocketImpl);
    
    // Assign to test variable
    mockSocket = mockSocketImpl;
  });

  afterEach(() => {
    // Clear all intervals
    activeIntervals.clear();
    
    // Clear all handlers
    pongHandlers.clear();
    disconnectHandlers.clear();
    
    // Reset callbacks
    pingIntervalCallback = undefined;
    checkIntervalCallback = undefined;
    
    // Clear all timers and mocks
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should initialize with ping interval', () => {
    // Reset mock calls before test
    setIntervalSpy.mockClear();
    
    // Call onModuleInit to set up the ping interval
    (gateway as any).onModuleInit();
    
    // Verify the WebSocket server was registered with RTC gateway
    expect(mockRtcGateway.registerWsServer).toHaveBeenCalledWith(expect.anything());
    
    // Should have set up the ping interval (30s)
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
    
    // The interval should be stored in the instance
    expect((gateway as any).pingInterval).toBeDefined();
    
    // Clean up intervals
    jest.clearAllTimers();
  });

  it('should send ping and handle pong', async () => {
    // Setup
    (gateway as any).onModuleInit();
    
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Get the first interval callback (ping)
    const pingCallback = setIntervalSpy.mock.calls[0][0];
    
    // Reset mocks before testing
    (mockSocket.emit as jest.Mock).mockClear();
    
    // Trigger ping
    pingCallback();
    
    // Wait for any async operations
    await new Promise(process.nextTick);
    
    // Should have sent a ping
    expect(mockSocket.emit).toHaveBeenCalledWith('ping', { timestamp: expect.any(Number) });
    
    // Get the pong handler
    const pongHandler = mockSocket.on.mock.calls.find(
      (call: [string, any]) => call[0] === 'pong'
    )?.[1];
    expect(pongHandler).toBeDefined();
    
    // Get the timestamp from the ping
    const pingCall = mockSocket.emit.mock.calls.find(
      (call: [string, any]) => call[0] === 'ping'
    );
    expect(pingCall).toBeDefined();
    const pingData = pingCall[1];
    
    // Simulate pong response with the same timestamp
    pongHandler({ timestamp: pingData.timestamp });
    
    // Should have reset missed pongs counter
    const missedPongs = (gateway as any).missedPongs as Map<string, number>;
    expect(missedPongs.get('test-socket-1')).toBe(0);
    
    // Verify presence was updated
    expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith('test-user-1');
    
    // Clean up
    mockSocket.emit.mockClear();
    mockPresenceService.updateUserPresence.mockClear();
  });

  it('should clean up on disconnection', () => {
    // Setup
    (gateway as any).onModuleInit();
    
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Get the missedPongs map
    const missedPongs = (gateway as any).missedPongs as Map<string, number>;
    
    // Add test data
    missedPongs.set('test-socket-1', 1);
    
    // Reset mocks
    mockServer.emit.mockClear();
    
    // Simulate disconnection
    gateway.handleDisconnect(mockSocket);
    
    // Should clean up client data
    expect(missedPongs.has('test-socket-1')).toBe(false);
    
    // Verify userOffline event was emitted to all clients
    expect(mockServer.emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user-1' });
  });

  it('should handle missed pongs and disconnect', () => {
    // Setup
    (gateway as any).onModuleInit();
    
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Get the missedPongs map and set a high missed pong count
    const missedPongs = (gateway as any).missedPongs as Map<string, number>;
    const MAX_MISSED_PONGS = 2;
    missedPongs.set('test-socket-1', MAX_MISSED_PONGS + 1);
    
    // Get the checkPongs interval from the connection handler
    const checkPongsCall = setIntervalSpy.mock.calls.find(
      (call: any[]) => call[1] === 35000
    );
    const checkPongsInterval = checkPongsCall?.[0];
    
    // Reset mocks
    mockSocket.disconnect.mockClear();
    
    // Simulate the checkPongs interval
    if (checkPongsInterval) {
      checkPongsInterval();
    }
    
    // Verify disconnect was called
    expect(mockSocket.disconnect).toHaveBeenCalled();
    
    // Clean up
    if (checkPongsInterval) {
      clearInterval(checkPongsInterval);
    }
  });
});
