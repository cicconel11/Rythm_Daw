import WebSocket, { Server as WebSocketServer } from 'ws';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';
import { io, Socket } from 'socket.io-client';
import { Server as SocketIOServer } from 'socket.io';

jest.mock('uws', () => ({
  restoreAdapter: jest.fn(),
}));

// Simple WebSocket server test that doesn't depend on NestJS
describe('Standalone WebSocket Server', () => {
  let httpServer: HttpServer;
  let wsServer: WebSocketServer;
  let socket: Socket;
  let port: number;

  beforeAll((done) => {
    try {
      console.log('1. Creating HTTP server...');
      
      // 1. Create HTTP server
      httpServer = createServer();
      
      // 2. Create WebSocket server
      wsServer = new WebSocketServer({ server: httpServer });
      
      // Add error handler to HTTP server
      httpServer.on('error', (error) => {
        console.error('HTTP server error:', error);
      });
      
      console.log('2. Creating Socket.IO server...');
      
      // 3. Create Socket.IO server with detailed logging
      const ioServer = new SocketIOServer(httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
        connectTimeout: 10000,
        pingTimeout: 10000,
        pingInterval: 25000,
      });
      
      // Add connection state logging (Socket.IO v4+ compatible)
      ioServer.on('connection_error', (err) => {
        console.error('Socket.IO connection error:', err);
      });
      
      // Add error handling for HTTP server
      ioServer.on('error', (err) => {
        console.error('Socket.IO server error:', err);
      });
      
      console.log('3. Setting up connection handlers...');
      
      // Simple connection handler with detailed logging (Socket.IO v4+ compatible)
      ioServer.on('connection', (client: any) => {
        const transport = client.conn?.transport || client.conn?._transport;
        const transportName = transport?.name || 'unknown';
        
        console.log(`Client connected: ${client.id} (transport: ${transportName})`);
        
        // Log transport upgrade if available
        if (client.conn?.on) {
          client.conn.on('upgrade', () => {
            const newTransport = client.conn?.transport || client.conn?._transport;
            const newTransportName = newTransport?.name || 'unknown';
            console.log(`Client ${client.id} upgraded to: ${newTransportName}`);
          });
        }
        
        client.on('ping', (data: any) => {
          console.log(`Received ping from ${client.id}:`, data);
          const transport = client.conn?.transport || client.conn?._transport;
          const transportName = transport?.name || 'unknown';
          
          client.emit('pong', { 
            ...data, 
            serverTime: Date.now(),
            transport: transportName
          });
        });
        
        client.on('disconnect', (reason: string) => {
          console.log(`Client ${client.id} disconnected:`, reason);
        });
      });
      
      console.log('4. Starting HTTP server...');
      
      // Start server
      httpServer.listen(0, '127.0.0.1', () => {
        port = (httpServer.address() as AddressInfo).port;
        console.log(`Test server listening on port ${port}`);
        done();
      });
    } catch (error) {
      console.error('Error in beforeAll:', error);
      done(error);
    }
  }, 15000);

  afterAll((done) => {
    console.log('Cleaning up...');
    
    if (socket) {
      socket.disconnect();
    }
    
    if (httpServer) {
      httpServer.close(() => {
        console.log('HTTP server closed');
        done();
      });
    } else {
      done();
    }
  });

  it('should establish WebSocket connection and exchange messages', (done) => {
    try {
      const socketUrl = `http://localhost:${port}`;
      console.log(`\n=== Starting WebSocket Test ===`);
      console.log(`1. Connecting to WebSocket server at ${socketUrl}...`);
      
      // Log environment info
      console.log('Environment:');
      console.log(`- Node.js: ${process.version}`);
      console.log(`- Platform: ${process.platform} ${process.arch}`);
      console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
      
      // Create socket.io client with detailed options
      const socketOptions = {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: false,
        forceNew: true,
        upgrade: true,
        rememberUpgrade: true,
        path: '/socket.io/',
        query: {
          test: 'true',
          clientType: 'test-suite',
          timestamp: Date.now()
        },
        extraHeaders: {
          'x-test-client': 'jest-test'
        },
        timeout: 10000
      };
      
      console.log('2. Creating socket.io client with options:', JSON.stringify(socketOptions, null, 2));
      
      socket = io(socketUrl, socketOptions);
      
      // Set test timeout
      const testTimeout = setTimeout(() => {
        console.error('❌ Test timeout reached (10s)');
        console.log('Socket connected:', socket.connected);
        console.log('Socket ID:', socket.id);
        socket.disconnect();
        done(new Error('Test timeout'));
      }, 10000);
      
      // Log all socket events for debugging
      const events = [
        'connect', 'connect_error', 'error', 'disconnect', 'reconnect_attempt',
        'reconnect_error', 'reconnect_failed', 'ping', 'pong', 'message'
      ];
      
      events.forEach(event => {
        socket.on(event, (...args) => {
          console.log(`[client:${event}]`, ...args);
        });
      });
      
      // Connection established
      socket.on('connect', () => {
        console.log('✅ Connected to WebSocket server');
        console.log('   - Socket ID:', socket.id);
        console.log('   - Transport:', socket.io.engine.transport.name);
        
        // Send a test message
        const testMessage = { 
          message: 'ping',
          timestamp: Date.now(),
          testId: 'test-' + Math.random().toString(36).substr(2, 9)
        };
        
        console.log('3. Sending ping:', testMessage);
        socket.emit('ping', testMessage);
        
        // Listen for pong response
        socket.on('pong', (response: any) => {
          console.log('4. Received pong:', response);
          try {
            expect(response).toHaveProperty('message', 'ping');
            expect(response).toHaveProperty('testId', testMessage.testId);
            expect(response).toHaveProperty('serverTime');
            expect(response).toHaveProperty('transport');
            
            console.log('✅ All assertions passed');
            
            // Clean up and complete the test
            clearTimeout(testTimeout);
            socket.disconnect();
            done();
          } catch (error) {
            clearTimeout(testTimeout);
            socket.disconnect();
            done(error);
          }
        });
      });
      
      // Error handling
      socket.on('connect_error', (error: any) => {
        console.error('❌ Connection error:', error.message);
        console.error('Error details:', error);
        clearTimeout(testTimeout);
        done(error);
      });
      
      socket.on('error', (error: any) => {
        console.error('❌ Socket error:', error.message);
        console.error('Error details:', error);
        clearTimeout(testTimeout);
        done(error);
      });
      
      socket.on('disconnect', (reason: string) => {
        console.log('ℹ️  Disconnected:', reason);
      });
    } catch (error) {
      console.error('❌ Test error:', error);
      done(error);
    }
  }, 15000);
});
