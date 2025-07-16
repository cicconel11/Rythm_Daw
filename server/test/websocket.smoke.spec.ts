import { io, Socket } from 'socket.io-client';
import { JwtService } from '@nestjs/jwt';
import { setupTestApp, teardownTestApp } from './websocket-test.setup';

describe('WebSocket Smoke Test', () => {
  let port: number;
  let jwtService: JwtService;
  
  beforeAll(async () => {
    const { app } = await setupTestApp();
    port = app.getHttpServer().address().port;
    
    // Get JWT service from the app
    const moduleFixture = app.select(AppModule);
    jwtService = moduleFixture.get<JwtService>(JwtService);
  }, 30000); // 30s timeout for setup

  afterAll(async () => {
    await teardownTestApp();
  });

  it('should connect to WebSocket server and receive a ping', (done) => {
    // Create a test JWT token
    const token = jwtService.sign({
      sub: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User'
    });

    // Create WebSocket client
    const socket = io(`http://localhost:${port}`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: false,
      timeout: 5000
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
