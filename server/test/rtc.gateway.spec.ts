import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RtcGateway } from '../src/modules/rtc/rtc.gateway';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { AppModule } from '../src/app.module';

type AnyFunction = (...args: any[]) => any;

interface TestSocket {
  id: string;
  user: { sub: string };
  join: jest.Mock;
  leave: jest.Mock;
  to: jest.Mock;
  emit: jest.Mock;
  on: jest.Mock<TestSocket, [string, AnyFunction]>;
  disconnect: jest.Mock;
  trigger: (event: string, ...args: any[]) => void;
  joinRoomHandler: (roomId: string) => void;
  offerHandler: (data: any) => void;
  answerHandler: (data: any) => void;
  iceCandidateHandler: (data: any) => void;
  disconnectHandler: () => void;
  [key: string]: any; // Allow dynamic properties
}

const createMockSocket = (id: string, userId: string): TestSocket => {
  const events: Record<string, AnyFunction> = {};
  
  // Define the base socket interface
  interface BaseSocket extends Omit<TestSocket, 'on' | 'trigger'> {
    on: jest.Mock<BaseSocket, [string, AnyFunction]>;
    trigger: (event: string, ...args: any[]) => void;
  }

  // Create a base mock socket with all required methods
  const baseSocket: BaseSocket = {
    id,
    user: { sub: userId },
    join: jest.fn(),
    leave: jest.fn(),
    to: jest.fn().mockReturnThis(),
    emit: jest.fn().mockReturnThis(),
    on: jest.fn((event: string, callback: AnyFunction) => {
      events[event] = callback;
      return baseSocket;
    }) as jest.Mock<BaseSocket, [string, AnyFunction]>,
    disconnect: jest.fn(),
    trigger: (event: string, ...args: any[]) => {
      if (events[event]) {
        events[event](...args);
      }
    },
    joinRoomHandler: jest.fn((roomId: string) => {
      baseSocket.trigger('joinRoom', roomId);
    }) as unknown as jest.Mock,
    offerHandler: jest.fn((data: any) => {
      baseSocket.trigger('offer', data);
    }) as unknown as jest.Mock,
    answerHandler: jest.fn((data: any) => {
      baseSocket.trigger('answer', data);
    }) as unknown as jest.Mock,
    iceCandidateHandler: jest.fn((data: any) => {
      baseSocket.trigger('ice-candidate', data);
    }) as unknown as jest.Mock,
    disconnectHandler: jest.fn(() => {
      baseSocket.trigger('disconnect');
    }) as unknown as jest.Mock
  };

  // Create the bound socket with all required properties and methods
  const boundSocket: TestSocket = {
    // Required properties
    id: baseSocket.id,
    user: baseSocket.user,
    
    // Socket.IO methods
    join: baseSocket.join.bind(baseSocket),
    leave: baseSocket.leave.bind(baseSocket),
    to: baseSocket.to.bind(baseSocket),
    emit: baseSocket.emit.bind(baseSocket),
    on: baseSocket.on.bind(baseSocket),
    disconnect: baseSocket.disconnect.bind(baseSocket),
    
    // Event handlers
    joinRoomHandler: baseSocket.joinRoomHandler.bind(baseSocket),
    offerHandler: baseSocket.offerHandler.bind(baseSocket),
    answerHandler: baseSocket.answerHandler.bind(baseSocket),
    iceCandidateHandler: baseSocket.iceCandidateHandler.bind(baseSocket),
    disconnectHandler: baseSocket.disconnectHandler.bind(baseSocket),
    
    // Trigger function for testing
    trigger: baseSocket.trigger
  };

  return boundSocket;
};

// Helper to create a type that allows any property access for testing
type AnyForTest = any;

describe('RtcGateway', () => {
  let gateway: RtcGateway;
  let app: INestApplication;
  let httpServer: HttpServer;
  let io: SocketIOServer;
  let port: number;

  let mockClient1: TestSocket;
  let mockClient2: TestSocket;
  let mockClient3: TestSocket;

  const createClient = (id: string, userId: string): TestSocket => {
    return createMockSocket(id, userId);
  };

  beforeAll(async () => {
    // Create testing module and application
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Create HTTP server and Socket.IO server directly
    httpServer = createServer();
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      // Use polling first to avoid wsEngine issues
      transports: ['polling', 'websocket'],
      allowEIO3: true,
    });
    
    // Start the application
    await app.init();
    
    // Start listening on a random port
    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        const address = httpServer.address() as AddressInfo;
        port = address.port;
        resolve();
      });
    });

    // Get the gateway instance
    gateway = moduleFixture.get<RtcGateway>(RtcGateway);
    
    // Manually attach the server to the gateway
    (gateway as any).server = io;

    // Initialize mock clients
    mockClient1 = createClient('client1', 'user1');
    mockClient2 = createClient('client2', 'user2');
    mockClient3 = createClient('client3', 'user3');

    // Simulate connections
    await gateway.handleConnection(mockClient1 as any);
    await gateway.handleConnection(mockClient2 as any);
    await gateway.handleConnection(mockClient3 as any);
  });

  afterAll(async () => {
    // Close the Socket.IO server and HTTP server
    if (io) {
      await new Promise<void>((resolve) => io.close(() => resolve()));
    }
    
    // Close the HTTP server
    if (httpServer) {
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    }
    
    // Close the NestJS application
    if (app) {
      await app.close();
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleConnection', () => {
    it('should add client to connected clients', async () => {
      const newClient = createClient('new-client', 'new-user');
      await gateway.handleConnection(newClient as AnyForTest);

      expect((gateway as AnyForTest).connectedClients).toHaveProperty(newClient.id);

      await gateway.handleDisconnect(newClient as AnyForTest);
    });
  });

  describe('handleDisconnect', () => {
    it('should remove client from connected clients', async () => {
      const tempClient = createClient('temp-client', 'temp-user');
      await gateway.handleConnection(tempClient as AnyForTest);

      expect((gateway as AnyForTest).connectedClients).toHaveProperty(tempClient.id);

      await gateway.handleDisconnect(tempClient as AnyForTest);

      expect((gateway as AnyForTest).connectedClients).not.toHaveProperty(tempClient.id);
    });
  });

  describe('handleJoinRoom', () => {
    it('should allow client to join a room', () => {
      const roomId = 'test-room';

      mockClient1.joinRoomHandler(roomId);

      expect(mockClient1.join).toHaveBeenCalledWith(roomId);

      expect(mockClient1.emit).toHaveBeenCalledWith('joinedRoom', { roomId });
    });
  });

  describe('handleOffer', () => {
    it('should forward offer to target client', () => {
      const targetClientId = 'client2';
      const offer = { sdp: 'test-offer' };

      mockClient1.offerHandler({ targetClientId, offer });

      expect(mockClient2.emit).toHaveBeenCalledWith('offer', {
        senderId: mockClient1.id,
        offer,
      });
    });
  });

  describe('handleAnswer', () => {
    it('should forward answer to target client', () => {
      const targetClientId = 'client1';
      const answer = { sdp: 'test-answer' };

      mockClient2.answerHandler({ targetClientId, answer });

      expect(mockClient1.emit).toHaveBeenCalledWith('answer', {
        senderId: mockClient2.id,
        answer,
      });
    });
  });

  describe('handleIceCandidate', () => {
    it('should forward ICE candidate to target client', () => {
      const targetClientId = 'client2';
      const candidate = { candidate: 'test-candidate' };

      mockClient1.iceCandidateHandler({ targetClientId, candidate });

      // Verify ICE candidate was forwarded to target client
      expect(mockClient2.emit).toHaveBeenCalledWith('ice-candidate', {
        senderId: mockClient1.id,
        candidate,
      });
    });
  });
});