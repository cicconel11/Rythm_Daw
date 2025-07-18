import { io, Socket } from 'socket.io-client';
import { JwtService } from '@nestjs/jwt';
import { createWsTestApp, teardownTestApp } from './websocket-test.setup';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';

// Test configuration
const TEST_CONFIG = {
  TEST_USER: {
    id: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User'
  },
  TIMEOUT: 10000, // 10 seconds
  PING_INTERVAL: 30000, // 30 seconds
  PONG_TIMEOUT: 5000 // 5 seconds
};

describe('WebSocket Smoke Test', () => {
  let app: INestApplication;
  let port: number;
  let jwtService: JwtService;
  let testToken: string;
  
  beforeAll(async () => {
    // Setup test application
    const testApp = await createWsTestApp();
    app = testApp.app;
    port = app.getHttpServer().address().port;
    
    // Get JWT service from the app
    const moduleFixture = app.select(AppModule);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    
    // Generate test token
    testToken = jwtService.sign({
      sub: TEST_CONFIG.TEST_USER.id,
      email: TEST_CONFIG.TEST_USER.email,
      name: TEST_CONFIG.TEST_USER.name
    });
  }, 30000);

  afterAll(async () => {
    await teardownTestApp();
  });

  // Helper function to create a WebSocket client
  const createSocketClient = (options = {}) => {
    return io(`http://localhost:${port}`, {
      auth: { token: testToken },
      transports: ['websocket', 'polling'],
      reconnection: false,
      timeout: TEST_CONFIG.PONG_TIMEOUT,
      forceNew: true,
      ...options
    });
  };

  // Helper function to wait for an event
  const waitForEvent = (socket: Socket, event: string, timeout = 5000): Promise<any> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(event, handler);
        reject(new Error(`Timeout waiting for ${event}`));
      }, timeout);
      
      const handler = (data: any) => {
        clearTimeout(timer);
        resolve(data);
      };
      
      socket.once(event, handler);
    });
  };

  // 1. Test connection
  it('should establish WebSocket connection', async () => {
    const socket = createSocketClient();
    
    try {
      await waitForEvent(socket, 'connect');
      expect(socket.connected).toBe(true);
      
      // Test basic event emission
      const testEvent = await new Promise<any>((resolve) => {
        socket.emit('test', { test: 'data' }, (response: any) => {
          resolve(response);
        });
      });
      
      expect(testEvent).toBeDefined();
    } finally {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  });

  // 2. Test authentication
  it('should reject connection with invalid token', async () => {
    const socket = createSocketClient({
      auth: { token: 'invalid-token' }
    });

    await expect(
      new Promise((resolve, reject) => {
        socket.on('connect', () => resolve('connected'));
        socket.on('connect_error', (error) => reject(error));
      })
    ).rejects.toThrow();

    if (socket.connected) {
      socket.disconnect();
    }
  });

  // 3. Test message exchange
  it('should send and receive messages', async () => {
    const socket = createSocketClient();
    const testMessage = { type: 'test', data: 'Hello WebSocket' };
    
    try {
      // Wait for connection
      await waitForEvent(socket, 'connect');
      
      // Test echo functionality
      const response = await new Promise<any>((resolve, reject) => {
        socket.emit('echo', testMessage, (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        });
        
        setTimeout(() => {
          reject(new Error('No response received'));
        }, TEST_CONFIG.TIMEOUT);
      });
      
      expect(response).toEqual(expect.objectContaining({
        ...testMessage,
        timestamp: expect.any(Number)
      }));
    } finally {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  });

  // 4. Test ping/pong heartbeat
  it('should maintain connection with ping/pong', async () => {
    const socket = createSocketClient({
      pingTimeout: 10000,
      pingInterval: 5000
    });
    
    try {
      await waitForEvent(socket, 'connect');
      
      // Verify connection is maintained
      await new Promise(resolve => setTimeout(resolve, 3000));
      expect(socket.connected).toBe(true);
    } finally {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  });

  // 5. Test disconnection
  it('should handle disconnection', async () => {
    const socket = createSocketClient();
    
    try {
      await waitForEvent(socket, 'connect');
      expect(socket.connected).toBe(true);
      
      // Test graceful disconnection
      await new Promise<void>((resolve) => {
        socket.on('disconnect', (reason) => {
          expect(reason).toBe('io client disconnect');
          resolve();
        });
        socket.disconnect();
      });
      
      expect(socket.connected).toBe(false);
    } finally {
      if (socket.connected) {
        socket.disconnect();
      }
    }
  });
  
  // 6. Test concurrent connections
  it('should handle multiple concurrent connections', async () => {
    const NUM_CLIENTS = 5;
    const clients = Array(NUM_CLIENTS).fill(0).map(() => createSocketClient());
    
    try {
      // Wait for all clients to connect
      await Promise.all(
        clients.map(client => waitForEvent(client, 'connect'))
      );
      
      // Verify all clients are connected
      clients.forEach(client => {
        expect(client.connected).toBe(true);
      });
      
      // Test message broadcasting
      const testMessage = { type: 'broadcast', message: 'Hello all' };
      const responses = await Promise.all(
        clients.map(client => 
          new Promise(resolve => {
            client.on('broadcast', resolve);
            client.emit('broadcast', testMessage);
          })
        )
      );
      
      // Each client should receive the broadcast
      responses.forEach(response => {
        expect(response).toEqual(expect.objectContaining(testMessage));
      });
    } finally {
      // Clean up all clients
      clients.forEach(client => {
        if (client.connected) {
          client.disconnect();
        }
      });
    }
  });
});
