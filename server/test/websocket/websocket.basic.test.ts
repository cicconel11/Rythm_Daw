import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { AddressInfo } from 'net';
import { io, Socket } from 'socket.io-client';

describe('Basic WebSocket Test', () => {
  let httpServer: HttpServer;
  let ioServer: any;
  let socket: Socket;
  let port: number;

  beforeAll((done) => {
    console.log('Setting up test environment...');
    
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    ioServer = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling'],
      pingInterval: 10000,
      pingTimeout: 5000
    });
    
    // Handle connections
    ioServer.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      socket.on('message', (data) => {
        console.log(`Received message from ${socket.id}:`, data);
        socket.emit('message', { echo: data, timestamp: Date.now() });
      });
      
      socket.on('ping', () => {
        console.log(`Ping from ${socket.id}`);
        socket.emit('pong', { timestamp: Date.now() });
      });
      
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
    
    // Start server
    httpServer.listen(0, '127.0.0.1', () => {
      port = (httpServer.address() as AddressInfo).port;
      console.log(`Test server listening on port ${port}`);
      done();
    });
  });

  afterAll((done) => {
    console.log('Cleaning up...');
    
    // Helper function to close everything
    const closeAll = () => {
      if (socket && socket.connected) {
        console.log('Disconnecting client...');
        socket.disconnect();
      }
      
      if (ioServer) {
        console.log('Closing Socket.IO server...');
        ioServer.close();
      }
      
      if (httpServer) {
        console.log('Closing HTTP server...');
        httpServer.close((err) => {
          if (err) {
            console.error('Error closing HTTP server:', err);
          } else {
            console.log('Test server closed');
          }
          done();
        });
      } else {
        done();
      }
    };
    
    // Start cleanup
    closeAll();
  });

  it('should connect and exchange messages', (done) => {
    const socketUrl = `http://localhost:${port}`;
    console.log(`\n=== Starting WebSocket Test ===`);
    console.log(`1. Connecting to: ${socketUrl}`);
    
    // Log environment info
    console.log('Environment:');
    console.log(`- Node.js: ${process.version}`);
    console.log(`- Platform: ${process.platform} ${process.arch}`);
    console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
    
    // Create client with detailed options
    const socketOptions = {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: false,
      forceNew: true,
      upgrade: true,
      rememberUpgrade: true,
      timeout: 10000,
      query: {
        test: 'true',
        clientType: 'test-suite',
        timestamp: Date.now()
      },
      extraHeaders: {
        'x-test-client': 'jest-test'
      }
    };
    
    console.log('2. Creating socket.io client with options:', JSON.stringify(socketOptions, null, 2));
    
    socket = io(socketUrl, socketOptions);
    
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
    
    // Test timeout
    const testTimeout = setTimeout(() => {
      console.error('❌ Test timeout (10s)');
      console.log('Socket connected:', socket.connected);
      console.log('Socket ID:', socket.id);
      socket.disconnect();
      done(new Error('Test timeout'));
    }, 10000);
    
    // Connection established
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      console.log(`   - Socket ID: ${socket.id}`);
      console.log('   - Transport:', socket.io.engine?.transport?.name || 'unknown');
      
      // Send test message
      const testMessage = { 
        message: 'ping',
        timestamp: Date.now(),
        testId: 'test-' + Math.random().toString(36).substr(2, 9)
      };
      
      console.log('3. Sending ping:', testMessage);
      
      // Listen for response
      const pongListener = (response: any) => {
        console.log('4. Received pong:', response);
        
        try {
          expect(response).toHaveProperty('message', 'ping');
          expect(response).toHaveProperty('testId', testMessage.testId);
          expect(response).toHaveProperty('serverTime');
          
          console.log('✅ Test passed!');
          socket.off('pong', pongListener);
          clearTimeout(testTimeout);
          socket.disconnect();
          done();
        } catch (error) {
          socket.off('pong', pongListener);
          clearTimeout(testTimeout);
          socket.disconnect();
          done(error instanceof Error ? error : new Error(String(error)));
        }
      };
      
      // Set up pong listener before sending ping
      socket.on('pong', pongListener);
      
      // Send the ping message
      socket.emit('ping', testMessage);
    });
    
    // Error handling
    socket.on('connect_error', (error: any) => {
      console.error('❌ Connection error:', error.message);
      clearTimeout(testTimeout);
      done(error);
    });
    
    socket.on('error', (error: any) => {
      console.error('❌ Socket error:', error.message);
      clearTimeout(testTimeout);
      done(error);
    });
  }, 10000);
});
