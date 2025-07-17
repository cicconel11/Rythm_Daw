import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../src/app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createServer, Server as HttpServer } from 'http';
import * as WebSocket from 'ws';

const TEST_PORT = 3001;

describe('WebSocket (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  let socket: Socket;
  let wss: WebSocket.Server;

  beforeAll(async () => {
    // Create testing module
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Create app instance
    app = moduleFixture.createNestApplication();
    
    // Configure WebSocket adapter with IoAdapter
    app.useWebSocketAdapter(new IoAdapter(app));
    
    // Initialize app
    await app.init();
    
    // Start HTTP server
    httpServer = await app.listen(TEST_PORT);
    
    // Setup WebSocket server
    wss = new WebSocket.Server({ server: httpServer });
    
    // Handle WebSocket connections
    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      
      // Handle incoming messages
      ws.on('message', (message: string) => {
        console.log('Received:', message);
        // Echo the message back
        ws.send(`Echo: ${message}`);
      });
      
      // Handle client disconnection
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  });

  afterAll(async () => {
    // Close WebSocket server
    if (wss) {
      wss.close();
    }
    
    // Close HTTP server and app
    if (httpServer) {
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    }
    
    if (app) {
      await app.close();
    }
  });

  afterEach(() => {
    // Clean up socket after each test
    if (socket?.connected) {
      socket.disconnect();
    }
  });

  it('should connect to WebSocket server', (done) => {
    socket = io(`http://localhost:${TEST_PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      done();
    });

    socket.on('connect_error', (err) => {
      done(err);
    });
  }, 10000);

  it('should send and receive messages', (done) => {
    const testMessage = 'Hello, WebSocket!';
    
    socket = io(`http://localhost:${TEST_PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    socket.on('connect', () => {
      socket.emit('message', testMessage);
    });
    
    // Listen for the echo response
    socket.on('message', (data: string) => {
      try {
        expect(data).toBe(`Echo: ${testMessage}`);
        done();
      } catch (err) {
        done(err);
      }
    });
    
    socket.on('connect_error', (err) => {
      done(err);
    });
  }, 10000);

  it('should handle disconnection', (done) => {
    socket = io(`http://localhost:${TEST_PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    socket.on('connect', () => {
      expect(socket.connected).toBe(true);
      
      socket.on('disconnect', () => {
        expect(socket.connected).toBe(false);
        done();
      });
      
      // Initiate disconnection
      socket.disconnect();
    });
    
    socket.on('connect_error', (err) => {
      done(err);
    });
  }, 10000);
});
