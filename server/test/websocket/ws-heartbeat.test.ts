// Simple test file to verify WebSocket heartbeat functionality

import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';

describe('WebSocket Heartbeat', () => {
  let gateway: ChatGateway;
  let mockPresenceService: unknown;
  let mockRtcGateway: unknown;
  let mockServer: unknown;
  let mockSocket: unknown;
  let originalSetInterval: unknown;
  let originalClearInterval: unknown;
  let mockTimers: { id: NodeJS.Timeout; callback: () => void }[] = [];

  beforeEach(() => {
    // Mock timers
    originalSetInterval = global.setInterval;
    originalClearInterval = global.clearInterval;
    
    global.setInterval = (callback: () => void, ms: number) => {
      const id = { } as unknown as NodeJS.Timeout;
      mockTimers.push({ id, callback });
      return id;
    };
    
    global.clearInterval = (id: NodeJS.Timeout) => {
      mockTimers = mockTimers.filter(timer => timer.id !== id);
    };

    // Mock services
    mockPresenceService = {
      updateUserPresence: jest.fn(),
      removeUserPresence: jest.fn(),
      isOnline: jest.fn(),
    };

    mockRtcGateway = {
      registerWsServer: jest.fn(),
    };

    // Create gateway instance
    gateway = new ChatGateway(
      mockPresenceService,
      mockRtcGateway,
    );

    // Mock WebSocket server
    mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };
    gateway['server'] = mockServer;

    // Mock socket
    mockSocket = {
      id: 'test-socket-1',
      data: {
        user: {
          userId: 'test-user-1',
          email: 'test@example.com',
          name: 'Test User',
        },
      },
      emit: jest.fn(),
      join: jest.fn(),
      leave: jest.fn(),
      disconnect: jest.fn(),
    };
  });

  afterEach(() => {
    // Restore original timers
    global.setInterval = originalSetInterval as typeof global.setInterval;
    global.clearInterval = originalClearInterval as typeof global.clearInterval;
    mockTimers = [];
    jest.clearAllMocks();
  });

  it('should initialize with ping interval', () => {
    // The ping interval should be set up in the constructor
    expect(gateway['pingInterval']).toBeDefined();
  });

  it('should send ping to connected clients', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket as any);
    
    // Get the ping interval callback
    const pingInterval = mockTimers[0];
    expect(pingInterval).toBeDefined();
    
    // Mock Date.now()
    const originalDateNow = Date.now;
    const mockTimestamp = 1000;
    Date.now = jest.fn(() => mockTimestamp);
    
    // Trigger the ping interval
    pingInterval.callback();
    
    // Should have sent a ping
    expect((mockSocket as any).emit).toHaveBeenCalledWith('ping', { timestamp: mockTimestamp });
    
    // Restore Date.now
    Date.now = originalDateNow;
  });

  it('should handle pong response', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket as any);
    
    // Mock Date.now()
    const originalDateNow = Date.now;
    const mockTimestamp = 1000;
    Date.now = jest.fn(() => mockTimestamp);
    
    // Simulate receiving a pong
    const pingCallback = (mockSocket as any).emit.mock.calls[0][1];
    expect(typeof pingCallback).toBe('function');
    
    // Call the pong handler
    pingCallback({ timestamp: mockTimestamp });
    
    // Should reset missed pongs counter
    expect(gateway['missedPongs'].get((mockSocket as any).id)).toBe(0);
    
    // Restore Date.now
    Date.now = originalDateNow;
  });

  it('should disconnect client after missing pongs', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket as any);
    
    // Get the ping interval callback
    const pingInterval = mockTimers[0];
    
    // Trigger ping interval 3 times (missing 2 pongs)
    for (let i = 0; i < 3; i++) {
      pingInterval.callback();
    }
    
    // Should have disconnected the client
    expect((mockSocket as any).disconnect).toHaveBeenCalled();
  });

  it('should clean up on disconnection', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket as any);
    
    // Simulate disconnection
    gateway.handleDisconnect(mockSocket as any);
    
    // Should clean up client data
    expect(gateway['missedPongs'].has((mockSocket as any).id)).toBe(false);
  });
});
