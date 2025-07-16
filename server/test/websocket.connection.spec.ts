import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

const TEST_PORT = 3001;

describe('WebSocket Connection (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Start the HTTP server
    await app.listen(TEST_PORT);
    
    // Get JWT service
    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should connect to WebSocket server', (done) => {
    // Create a test JWT token
    const token = jwtService.sign({ 
      sub: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User' 
    });

    // Create WebSocket client
    const socket = io(`http://localhost:${TEST_PORT}`, {
      auth: { token },
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      socket.disconnect();
      done();
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      done.fail('Failed to connect to WebSocket server');
    });
  }, 10000); // 10 second timeout
});
