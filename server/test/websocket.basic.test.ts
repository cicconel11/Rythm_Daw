import { Server } from 'http';
import { AddressInfo } from 'net';
import { io, Socket } from 'socket.io-client';
import { Server as SocketIOServer } from 'socket.io';

describe('Basic WebSocket Test', () => {
  let httpServer: Server;
  let ioServer: any;
  let socket: Socket;
  let port: number;

  beforeAll((done) => {
    console.log('1. Setting up test server...');
    
    try {
      // Create HTTP server with error handling
      httpServer = new Server();
      
      // Add error handling to HTTP server
      httpServer.on('error', (error) => {
        console.error('HTTP server error:', error);
      });
      
      console.log('2. Creating Socket.IO server...');
      
      // Create Socket.IO server with minimal options
      ioServer = new SocketIOServer(httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
        // Add more detailed configuration
        connectTimeout: 10000,
        pingTimeout: 10000,
        pingInterval: 25000,
      });
      
      // Add error handling to Socket.IO server
      ioServer.on('error', (error: any) => {
        console.error('Socket.IO server error:', error);
      });
      
      console.log('3. Setting up connection handlers...');
      
      // Basic connection handler with detailed logging
      ioServer.sockets.on('connection', (client: any) => {
      console.log(`Client connected: ${client.id}`);
      
      client.on('ping', (data: any) => {
        console.log(`Received ping from ${client.id}:`, data);
        client.emit('pong', { 
          ...data, 
          serverTime: Date.now() 
        });
      });
      
      client.on('disconnect', () => {
        console.log(`Client disconnected: ${client.id}`);
      });
    });
    
    // Start server
    httpServer.listen(0, '127.0.0.1', () => {
      port = (httpServer.address() as AddressInfo).port;
      console.log(`Test server listening on port ${port}`);
      done();
    });
  }, 10000);

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
