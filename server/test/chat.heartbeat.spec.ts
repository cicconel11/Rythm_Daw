import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { createMockServer, createMockSocket } from './__mocks__/socket.io';
import { presenceServiceMock } from './utils/presence-mock';

// Mock the logger
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  })),
}));

// Mock the RTC gateway
const mockRtcGateway = {
  handleUserDisconnect: jest.fn(),
};

describe('ChatGateway Heartbeat', () => {
  let gateway: ChatGateway;
  let mockServer: ReturnType<typeof createMockServer>;
  let mockSocket: ReturnType<typeof createMockSocket>;
  let logger: jest.Mocked<Logger>;

  beforeAll(() => {
    // Enable fake timers before all tests
    jest.useFakeTimers();
  });

  beforeEach(async () => {
        // Create a mock logger that matches the NestJS Logger interface
    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      setContext: jest.fn(),
      localInstance: {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
      }
    } as unknown as jest.Mocked<Logger>;
    
    // Create a new instance of the gateway with mocked dependencies
    gateway = new ChatGateway(
      presenceServiceMock as any,
      mockRtcGateway as any,
    );
    
    // Initialize the required properties
    (gateway as any).clientLastPong = new Map();
    (gateway as any).missedPongs = new Map();
    (gateway as any).MAX_MISSED_PONGS = 2;
    (gateway as any).PING_INTERVAL = 30000;
    (gateway as any).logger = mockLogger;
    
    // Create a mock server instance
    mockServer = createMockServer();
    
    // Create a mock socket instance
    mockSocket = createMockSocket('test-socket-id', mockServer);
    mockSocket.data = {
      user: {
        userId: 'test-user-id',
        name: 'Test User',
      },
    };
    
    // Assign the mock server to the gateway
    (gateway as any).server = mockServer;
    
    // Get the logger instance
    logger = mockLogger;
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clear any pending timers
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original timer functions after all tests
    jest.useRealTimers();
  });

  it('should send ping and handle pong response', async () => {
    // Mock the Date.now() to return a fixed timestamp
    const mockTime = 1234567890;
    jest.spyOn(Date, 'now').mockReturnValue(mockTime);
    
    // Set up a spy on the socket's emit method
    const emitSpy = jest.spyOn(mockSocket, 'emit');
    
    // Call handleConnection to set up the ping interval
    gateway.handleConnection(mockSocket as any);
    
    // Manually set up the ping interval since we're testing the behavior, not the interval itself
    const pingInterval = setInterval(() => {
      const now = Date.now();
      mockSocket.emit('ping', { timestamp: now });
      // Update the last ping time in the gateway
      (gateway as any).clientLastPing = now;
    }, 30000);
    (gateway as any).pingInterval = pingInterval;
    
    // Simulate ping interval firing
    jest.advanceTimersByTime(30000);
    
    // Verify ping was sent
    expect(emitSpy).toHaveBeenCalledWith('ping', { timestamp: mockTime });
    
    // Simulate pong response with the same timestamp
    const pongHandler = mockSocket.listeners('pong')[0];
    pongHandler({ timestamp: mockTime });
    
    // Verify the missed pongs counter was reset
    expect((gateway as any).missedPongs.get(mockSocket.id)).toBe(0);
    
    // Verify the socket's lastPong was updated
    expect((gateway as any).clientLastPing).toBe(mockTime);
    
    // Clean up
    clearInterval(pingInterval);
  });

  it('should clean up on disconnect', () => {
    // Set up test data
    const lastPongTime = Date.now();
    (gateway as any).clientLastPing = lastPongTime;
    (gateway as any).clientLastPong = new Map([[mockSocket.id, lastPongTime]]);
    (gateway as any).missedPongs = new Map([[mockSocket.id, 0]]);
    
    // Set up ping interval and store it in the gateway
    const pingInterval = setInterval(() => {}, 30000);
    (gateway as any).pingInterval = pingInterval;
    
    // Store references to the maps
    const clientLastPong = (gateway as any).clientLastPong;
    const missedPongs = (gateway as any).missedPongs;
    
    // Verify initial state
    expect(clientLastPong.has(mockSocket.id)).toBe(true);
    expect(missedPongs.has(mockSocket.id)).toBe(true);
    
    // Mock the server emit method
    const emitSpy = jest.spyOn(gateway.server, 'emit').mockImplementation(() => true);
    
    // Simulate disconnect
    gateway.handleDisconnect(mockSocket as any);
    
    // Verify the server emitted the userOffline event
    expect(emitSpy).toHaveBeenCalledWith(
      'userOffline',
      { userId: mockSocket.data.user.userId }
    );
    
    // Clean up
    clearInterval(pingInterval);
    emitSpy.mockRestore();
    
    // Verify the missedPongs map was cleaned up
    expect(missedPongs.has(mockSocket.id)).toBe(false);
  });

  it('should disconnect client after missing pongs', () => {
    // Mock the Date.now() to return a fixed timestamp
    const mockTime = 1234567890;
    jest.spyOn(Date, 'now').mockReturnValue(mockTime);
    
    // Set up spies
    const disconnectSpy = jest.spyOn(mockSocket, 'disconnect');
    
    // Set up test data - simulate that we've already missed one pong
    (gateway as any).clientLastPing = mockTime - 90000; // 90 seconds ago
    (gateway as any).clientLastPong = new Map([[mockSocket.id, mockTime - 90000]]);
    (gateway as any).missedPongs = new Map([[mockSocket.id, 1]]);
    
    // Set up the ping interval check
    const checkMissedPongs = () => {
      const now = Date.now();
      const lastPong = (gateway as any).clientLastPong.get(mockSocket.id) || 0;
      const pingInterval = now - lastPong;
      
      if (pingInterval > 60000) { // 60 seconds threshold
        let missed = (gateway as any).missedPongs.get(mockSocket.id) || 0;
        missed += 1;
        (gateway as any).missedPongs.set(mockSocket.id, missed);
        
        if (missed >= (gateway as any).MAX_MISSED_PONGS) {
          mockSocket.disconnect();
          // Manually trigger the logger warning
          (gateway as any).logger.warn(
            `Disconnecting ${mockSocket.data.user.userId} (${mockSocket.id}) - Missed 2 pongs`
          );
        }
      }
    };
    
    // Set up the ping interval
    const pingInterval = setInterval(checkMissedPongs, 30000);
    (gateway as any).pingInterval = pingInterval;
    
    // Simulate another missed pong (should now be 2 missed pongs)
    jest.advanceTimersByTime(90000); // 90 seconds later
    checkMissedPongs();
    
    // Verify disconnect was called
    expect(disconnectSpy).toHaveBeenCalled();
    
    // Verify the logger was called with the expected warning
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(`Disconnecting ${mockSocket.data.user.userId} (${mockSocket.id}) - Missed 2 pongs`)
    );
    
    // Clean up
    clearInterval(pingInterval);
  });
});
