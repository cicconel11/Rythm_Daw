import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../src/app.module';


describe('WebSocket Connection', () => {
  let app: INestApplication;
  let port: number;

  beforeAll(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Create app
    app = moduleFixture.createNestApplication();
    
    // Initialize the app first
    await app.init();
    
    // Start HTTP server on a random port
    const server = await app.listen(0);
    port = server.address().port;
    
    console.log(`Test WebSocket server running on port ${port}`);
  }, 30000); // 30s timeout for setup

  afterAll(async () => {
    if (app) {
      await app.close();
      // Give the server a moment to close
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });

  it('should connect and receive a ping', (done) => {
    // Create WebSocket client
    const socket = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      autoConnect: true,
      forceNew: true,
      timeout: 5000,
    });

    const testTimeout = setTimeout(() => {
      socket.disconnect();
      done.fail('Test timed out waiting for ping');
    }, 10000);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('ping', (data) => {
      console.log('Received ping:', data);
      clearTimeout(testTimeout);
      socket.emit('pong', { timestamp: data.timestamp });
      socket.disconnect();
      done();
    });

    socket.on('connect_error', (error) => {
      clearTimeout(testTimeout);
      console.error('Connection error:', error);
      done.fail(`Failed to connect: ${error.message}`);
    });
  }, 15000); // 15s timeout for test
});
