import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../src/app.module';

const TEST_PORT = 3001;

describe('WebSocket Simple Test', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Create app
    app = moduleFixture.createNestApplication();
    
    // Enable CORS for testing
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Initialize the app
    await app.init();
    
    // Start HTTP server
    await app.listen(TEST_PORT);
    
    console.log(`Test server running on port ${TEST_PORT}`);
  }, 30000); // 30s timeout for setup

  afterAll(async () => {
    if (app) {
      await app.close();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });

  it('should connect to WebSocket server', (done) => {
    // Create WebSocket client
    const socket = io(`http://localhost:${TEST_PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      autoConnect: true,
      forceNew: true,
      timeout: 5000,
    });

    const testTimeout = setTimeout(() => {
      socket.disconnect();
      done.fail('Test timed out waiting for connection');
    }, 10000);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      clearTimeout(testTimeout);
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
