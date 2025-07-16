// Simple WebSocket heartbeat test that doesn't rely on NestJS testing framework
import { ChatGateway } from '../src/modules/chat/chat.gateway';

// Mock dependencies
class MockPresenceService {
  updateUserPresence = jest.fn();
  removeUserPresence = jest.fn();
  isOnline = jest.fn().mockReturnValue(true);
}

class MockRtcGateway {
  registerWsServer = jest.fn();
}

describe('WebSocket Heartbeat (Direct Test)', () => {
  let gateway: ChatGateway;
  let mockPresenceService: MockPresenceService;
  let mockRtcGateway: MockRtcGateway;
  let mockSocket: any;
  let mockServer: any;
  
  beforeEach(() => {
    // Create mock services
    mockPresenceService = new MockPresenceService();
    mockRtcGateway = new MockRtcGateway();
    
    // Create gateway instance
    gateway = new ChatGateway(
      mockPresenceService as any,
      mockRtcGateway as any
    );
    
    // Mock WebSocket server
    mockServer = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      sockets: {
        sockets: new Map()
      }
    };
    
    // Mock socket
    mockSocket = {
      id: 'test-socket-1',
      connected: true,
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
      on: jest.fn(),
      once: jest.fn(),
    };
    
    // Add socket to server's sockets map
    mockServer.sockets.sockets.set(mockSocket.id, mockSocket);
    
    // Assign mock server to gateway
    (gateway as any).server = mockServer;
  });
  
  afterEach(() => {
    // Clean up any intervals
    if ((gateway as any).pingInterval) {
      clearInterval((gateway as any).pingInterval);
    }
    jest.clearAllMocks();
  });
  
  it('should initialize with ping interval', () => {
    // The ping interval should be set up in the constructor
    expect((gateway as any).pingInterval).toBeDefined();
    expect((gateway as any).missedPongs).toBeInstanceOf(Map);
  });
  
  it('should handle connection and set up ping/pong', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Should set up pong handler
    expect(mockSocket.on).toHaveBeenCalledWith('pong', expect.any(Function));
    
    // Should set up disconnect handler
    expect(mockSocket.once).toHaveBeenCalledWith('disconnect', expect.any(Function));
    
    // Should update presence
    expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith('test-user-1');
  });
  
  it('should send ping to connected clients', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Get the ping interval function
    const pingInterval = (gateway as any).pingInterval;
    const originalDateNow = Date.now;
    const mockTimestamp = 1000;
    
    // Mock Date.now
    Date.now = () => mockTimestamp;
    
    try {
      // Trigger the ping interval
      pingInterval._onTimeout();
      
      // Should send ping to the socket
      expect(mockSocket.emit).toHaveBeenCalledWith('ping', { timestamp: mockTimestamp });
      
      // Should initialize missed pongs counter
      expect((gateway as any).missedPongs.get(mockSocket.id)).toBe(0);
    } finally {
      // Restore Date.now
      Date.now = originalDateNow;
    }
  });
  
  it('should handle pong response', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Trigger ping to set up the pong handler
    const pingInterval = (gateway as any).pingInterval;
    const mockTimestamp = 1000;
    const originalDateNow = Date.now;
    
    try {
      Date.now = () => mockTimestamp;
      pingInterval._onTimeout();
      
      // Get the pong handler
      const pongHandler = mockSocket.emit.mock.calls[0][1];
      
      // Reset mocks
      mockSocket.emit.mockClear();
      
      // Call the pong handler
      pongHandler({ timestamp: mockTimestamp });
      
      // Should reset missed pongs counter
      expect((gateway as any).missedPongs.get(mockSocket.id)).toBe(0);
    } finally {
      Date.now = originalDateNow;
    }
  });
  
  it('should disconnect client after missing pongs', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Get the ping interval function
    const pingInterval = (gateway as any).pingInterval;
    
    // Simulate missing pongs
    const MAX_MISSED_PONGS = 2;
    for (let i = 0; i < MAX_MISSED_PONGS + 1; i++) {
      pingInterval._onTimeout();
    }
    
    // Should disconnect the client
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });
  
  it('should clean up on disconnection', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Simulate disconnection
    gateway.handleDisconnect(mockSocket);
    
    // Should clean up
    expect(mockPresenceService.removeUserPresence).toHaveBeenCalledWith('test-user-1');
    expect(mockServer.emit).toHaveBeenCalledWith('userOffline', { userId: 'test-user-1' });
  });
});
