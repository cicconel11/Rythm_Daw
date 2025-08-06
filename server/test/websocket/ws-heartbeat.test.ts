// Simple test file to verify WebSocket heartbeat functionality

import { ChatGateway } from '../src/modules/chat/chat.gateway';

describe('WebSocket Heartbeat', () => {
  let gateway: ChatGateway;
  let _mockPresenceService: unknown;
  let _mockRtcGateway: unknown;
  let _mockServer: unknown;
  let _mockSocket: unknown;
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
    _mockPresenceService = {
      updateUserPresence: jest.fn(),
      removeUserPresence: jest.fn(),
      isOnline: jest.fn(),
    };

    _mockRtcGateway = {
      registerWsServer: jest.fn(),
    };

    // Create gateway instance
    gateway = new ChatGateway(
      _mockPresenceService,
      _mockRtcGateway,
    );

    // Mock WebSocket server
    _mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };
    gateway['server'] = _mockServer;

    // Mock socket
    _mockSocket = {
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
    gateway.handleConnection(_mockSocket as unknown as WebSocket);
    
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
    expect((_mockSocket as unknown as WebSocket).emit).toHaveBeenCalledWith('ping', { timestamp: mockTimestamp });
    
    // Restore Date.now
    Date.now = originalDateNow;
  });

  it('should handle pong response', () => {
    // Simulate connection
    gateway.handleConnection(_mockSocket as unknown as WebSocket);
    
    // Mock Date.now()
    const originalDateNow = Date.now;
    const mockTimestamp = 1000;
    Date.now = jest.fn(() => mockTimestamp);
    
    // Simulate receiving a pong
    const pingCallback = (_mockSocket as unknown as WebSocket).emit.mock.calls[0][1];
    expect(typeof pingCallback).toBe('function');
    
    // Call the pong handler
    pingCallback({ timestamp: mockTimestamp });
    
    // Should reset missed pongs counter
    expect(gateway['missedPongs'].get((_mockSocket as unknown as WebSocket).id)).toBe(0);
    
    // Restore Date.now
    Date.now = originalDateNow;
  });

  it('should disconnect client after missing pongs', () => {
    // Simulate connection
    gateway.handleConnection(_mockSocket as unknown as WebSocket);
    
    // Get the ping interval callback
    const pingInterval = mockTimers[0];
    
    // Trigger ping interval 3 times (missing 2 pongs)
    for (let i = 0; i < 3; i++) {
      pingInterval.callback();
    }
    
    // Should have disconnected the client
    expect((_mockSocket as unknown as WebSocket).disconnect).toHaveBeenCalled();
  });

  it('should clean up on disconnection', () => {
    // Simulate connection
    gateway.handleConnection(_mockSocket as unknown as WebSocket);
    
    // Simulate disconnection
    gateway.handleDisconnect(_mockSocket as unknown as WebSocket);
    
    // Should clean up client data
    expect(gateway['missedPongs'].has((_mockSocket as unknown as WebSocket).id)).toBe(false);
  });
});
