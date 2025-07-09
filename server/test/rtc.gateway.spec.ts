import { Test } from '@nestjs/testing';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { AuthenticatedSocket } from '../src/modules/rtc/rtc.gateway';

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let mockServer: any;
  let mockClient1: any;
  let mockClient2: any;
  let mockClient3: any;

  // Simple mock socket creator
  const createMockSocket = (id: string, user: { sub: string } = { sub: 'test-user' }) => {
    return {
      id,
      user,
      join: jest.fn().mockReturnThis(),
      disconnect: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      rooms: new Set([id])
    } as unknown as AuthenticatedSocket;
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RtcGateway],
    }).compile();

    gateway = module.get<RtcGateway>(RtcGateway);
    
    // Create a simple mock server with sockets map
    const socketsMap = new Map();
    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      in: jest.fn().mockReturnThis(),
      sockets: {
        sockets: socketsMap
      }
    };
    
    gateway.server = mockServer as any;
    
    // Create mock clients and add them to the server's sockets map
    mockClient1 = createMockSocket('client1', { sub: 'user1' });
    mockClient2 = createMockSocket('client2', { sub: 'user2' });
    mockClient3 = createMockSocket('client3', { sub: 'user1' }); // Same user as client1
    
    // Add clients to server's sockets map
    socketsMap.set('client1', mockClient1);
    socketsMap.set('client2', mockClient2);
    socketsMap.set('client3', mockClient3);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should add client to userSockets and socketToUser maps', async () => {
      await gateway.handleConnection(mockClient1);
      
      expect(mockClient1.join).toHaveBeenCalledWith('user1');
      expect(gateway['userSockets'].get('user1')).toBeDefined();
      expect(gateway['userSockets'].get('user1')?.has('client1')).toBe(true);
      expect(gateway['socketToUser'].get('client1')).toBe('user1');
    });

    it('should handle multiple connections from same user', async () => {
      await gateway.handleConnection(mockClient1);
      await gateway.handleConnection(mockClient3);
      
      expect(gateway['userSockets'].get('user1')?.size).toBe(2);
      expect(gateway['socketToUser'].get('client1')).toBe('user1');
      expect(gateway['socketToUser'].get('client3')).toBe('user1');
    });

    it('should disconnect client if user.sub is missing', async () => {
      // Create a client with an empty user object (missing 'sub' property)
      const invalidClient = createMockSocket('invalid-client', { sub: '' });
      invalidClient.user = { sub: '' }; // Explicitly set empty sub
      
      await gateway.handleConnection(invalidClient);
      
      expect(invalidClient.disconnect).toHaveBeenCalled();
      expect(gateway['userSockets'].size).toBe(0);
    });
  });

  describe('handleDisconnect', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient1);
      await gateway.handleConnection(mockClient2);
      await gateway.handleConnection(mockClient3);
    });

    it('should remove client from userSockets and socketToUser maps', () => {
      gateway.handleDisconnect(mockClient1);
      
      expect(gateway['userSockets'].get('user1')?.has('client1')).toBe(false);
      expect(gateway['socketToUser'].has('client1')).toBe(false);
      
      // Other connections remain
      expect(gateway['userSockets'].get('user1')?.has('client3')).toBe(true);
      expect(gateway['userSockets'].get('user2')?.has('client2')).toBe(true);
    });

    it('should clean up userSockets when last socket disconnects', () => {
      gateway.handleDisconnect(mockClient1);
      gateway.handleDisconnect(mockClient3);
      
      expect(gateway['userSockets'].has('user1')).toBe(false);
      expect(gateway['userSockets'].get('user2')?.has('client2')).toBe(true);
    });
  });

  describe('emitToUser', () => {
    beforeEach(async () => {
      await gateway.handleConnection(mockClient1);
      await gateway.handleConnection(mockClient2);
    });

    it('should emit event to user', () => {
      const event = 'test-event';
      const payload = { data: 'test' };
      
      const result = gateway.emitToUser('user1', event, payload);
      
      expect(result).toBe(true);
      expect(mockClient1.emit).toHaveBeenCalledWith(event, payload);
    });

    it('should return false for non-existent user', () => {
      const event = 'test-event';
      const payload = { data: 'test' };
      
      const result = gateway.emitToUser('non-existent-user', event, payload);
      
      expect(result).toBe(false);
      expect(mockClient1.emit).not.toHaveBeenCalled();
    });
  });

  describe('registerWsServer', () => {
    it('should register a WebSocket server instance', () => {
      const newServer = {
        to: jest.fn().mockReturnThis(),
        emit: jest.fn(),
        in: jest.fn().mockReturnThis(),
        sockets: {
          sockets: new Map()
        }
      };
      
      gateway.registerWsServer(newServer as any);
      
      expect(gateway.server).toBe(newServer);
    });
  });
});
