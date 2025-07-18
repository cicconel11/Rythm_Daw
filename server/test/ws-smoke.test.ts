import { Server } from 'http';
import { io as Client, Socket } from 'socket.io-client';
import { Server as SocketIOServer } from 'socket.io';

// Test configuration
const TEST_PORT = 3001;
const TEST_TIMEOUT = 5000;

describe('WebSocket Smoke Tests', () => {
  let httpServer: Server;
  let io: SocketIOServer;
  let clientSocket: Socket;

  // 1. Basic test structure with server/client setup
  beforeAll((done) => {
    // Create HTTP server
    httpServer = new Server();
    
    // Create Socket.IO server
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Set up connection handler
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      // Handle ping event
      socket.on('ping', (data, callback) => {
        console.log('Server received ping:', data);
        if (typeof callback === 'function') {
          callback({ ...data, timestamp: Date.now() });
        }
      });
      
      // Handle health check
      socket.on('health', (callback) => {
        if (typeof callback === 'function') {
          callback({ status: 'ok' });
        }
      });
    });

    // Start listening
    httpServer.listen(TEST_PORT, () => {
      console.log(`Test server listening on port ${TEST_PORT}`);
      done();
    });
  }, TEST_TIMEOUT);

  afterAll((done) => {
    // Clean up
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
    
    io.close(() => {
      httpServer.close(() => {
        console.log('Test server closed');
        done();
      });
    });
  });

  // 2. Connection testing with validation
  test('should establish WebSocket connection', (done) => {
    clientSocket = Client(`http://localhost:${TEST_PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 2000
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      clientSocket.disconnect();
      done();
    });

    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  }, TEST_TIMEOUT);

  // 3. Message handling tests
  test('should handle ping-pong messages', (done) => {
    clientSocket = Client(`http://localhost:${TEST_PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true
    });

    clientSocket.on('connect', () => {
      const testData = { message: 'test-ping' };
      
      clientSocket.emit('ping', testData, (response: any) => {
        try {
          expect(response).toBeDefined();
          expect(response.message).toBe(testData.message);
          expect(response.timestamp).toBeDefined();
          clientSocket.disconnect();
          done();
        } catch (err) {
          clientSocket.disconnect();
          done(err);
        }
      });
    });

    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  }, TEST_TIMEOUT);

  // 4. Health check endpoint
  test('should respond to health check', (done) => {
    clientSocket = Client(`http://localhost:${TEST_PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true
    });

    clientSocket.on('connect', () => {
      clientSocket.emit('health', (response: any) => {
        try {
          expect(response).toBeDefined();
          expect(response.status).toBe('ok');
          clientSocket.disconnect();
          done();
        } catch (err) {
          clientSocket.disconnect();
          done(err);
        }
      });
    });

    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  }, TEST_TIMEOUT);
});
