import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';
import { io as clientIo } from 'socket.io-client';
import { AppModule } from '../src/app.module';

async function createTestApp() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  
  // Use Socket.IO with HTTP server
  const httpServer = await app.listen(0);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  
  // Simple echo handler for testing
  io.on('connection', (socket) => {
    console.log('Test WebSocket client connected');
    
    socket.on('echo', (data, callback) => {
      if (typeof callback === 'function') {
        callback({ ...data, timestamp: Date.now() });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('Test WebSocket client disconnected');
    });
  });
  
  return { app, httpServer, io };
}

describe('WebSocket (Simple Test)', () => {
  let app: INestApplication;
  let httpServer: unknown;
  let port: number;
  
  beforeAll(async () => {
    const testApp = await createTestApp();
    app = testApp.app;
    httpServer = testApp.httpServer;
    port = httpServer.address().port;
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  it('should connect and echo a message', (done) => {
    const socket = clientIo(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
    });
    
    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      
      const testMessage = { test: 'data' };
      socket.emit('echo', testMessage, (response: unknown) => {
        try {
          expect(response).toHaveProperty('test', 'data');
          expect(response).toHaveProperty('timestamp');
          socket.disconnect();
          done();
        } catch (err) {
          done(err);
        }
      });
    });
    
    socket.on('connect_error', (err) => {
      done(err);
    });
  });
  
  it('should handle disconnection', (done) => {
    const socket = clientIo(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
    });
    
    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      
      socket.on('disconnect', () => {
        expect(socket.connected).toBe(false);
        done();
      });
      
      socket.disconnect();
    });
    
    socket.on('connect_error', (err) => {
      done(err);
    });
  });
});
