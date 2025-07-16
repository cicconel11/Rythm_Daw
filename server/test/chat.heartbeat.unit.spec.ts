import { Test } from '@nestjs/testing';
import { ChatGateway } from '../src/modules/chat/chat.gateway';
import { PresenceService } from '../src/modules/presence/presence.service';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';

describe('ChatGateway Heartbeat (Unit)', () => {
  let gateway: ChatGateway;
  let mockPresenceService: jest.Mocked<PresenceService>;
  let mockRtcGateway: jest.Mocked<RtcGateway>;
  let mockServer: any;
  let mockSocket: any;

  beforeEach(async () => {
    // Create mock services
    mockPresenceService = {
      updateUserPresence: jest.fn(),
      removeUserPresence: jest.fn(),
      isOnline: jest.fn(),
    } as any;

    mockRtcGateway = {
      registerWsServer: jest.fn(),
    } as any;

    // Create testing module
    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: PresenceService, useValue: mockPresenceService },
        { provide: RtcGateway, useValue: mockRtcGateway },
      ],
    }).compile();

    // Get gateway instance
    gateway = moduleRef.get<ChatGateway>(ChatGateway);

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

    // Mock Date.now()
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should initialize with ping interval', () => {
    // The ping interval should be set up in the constructor
    expect(gateway['pingInterval']).toBeDefined();
  });

  it('should send ping and handle pong', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);

    // Advance time to trigger ping
    jest.advanceTimersByTime(30000); // 30 seconds

    // Should have sent a ping
    expect(mockSocket.emit).toHaveBeenCalledWith('ping', { timestamp: 0 });

    // Simulate pong response
    const pingHandler = mockSocket.emit.mock.calls[0][1];
    expect(typeof pingHandler).toBe('function');
    
    // Call the pong handler
    pingHandler({ timestamp: 0 });
    
    // Should update last pong time
    expect(gateway['clientLastPong'].get('test-socket-1')).toBe(0);
  });

  it('should disconnect client after missing pongs', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);

    // Advance time to trigger 3 pings (90 seconds)
    jest.advanceTimersByTime(90000);

    // Should have tried to send 3 pings
    expect(mockSocket.emit).toHaveBeenCalledTimes(3);
    
    // Should have disconnected the client after missing 2 pongs
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should clean up on disconnection', () => {
    // Simulate connection
    gateway.handleConnection(mockSocket);
    
    // Simulate disconnection
    gateway.handleDisconnect(mockSocket);
    
    // Should clean up client data
    expect(gateway['clientLastPong'].has('test-socket-1')).toBe(false);
    
    // Should clear the interval if last client disconnects
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    gateway['connectedClients'] = 0;
    gateway.handleDisconnect(mockSocket);
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
