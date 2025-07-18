import { Server } from 'http';
import { AddressInfo } from 'net';
import { io, Socket } from 'socket.io-client';
import { Server as SocketIOServer } from 'socket.io';

describe('Minimal WebSocket Test', () => {
  let httpServer: Server;
  let ioServer: any;
  let socket: Socket;
  let port: number;

  beforeAll((done) => {
    console.log('1. Creating HTTP server...');
    
    httpServer = new Server();
    
    httpServer.on('error', (error) => {
      console.error('HTTP server error:', error);
    });
    
    console.log('2. Creating Socket.IO server...');
    
    ioServer = new SocketIOServer(httpServer, {
      cors: { origin: '*' },
      connectTimeout: 10000,
      pingTimeout: 10000,
      pingInterval: 25000,
    });
    
    ioServer.on('connection', (client: any) => {
      console.log(`Client connected: ${client.id}`);
      
      client.on('ping', (data: any) => {
        console.log('Received ping:', data);
        client.emit('pong', { ...data, serverTime: Date.now() });
      });
      
      client.on('disconnect', () => {
        console.log(`Client disconnected: ${client.id}`);
      });
    });
    
    httpServer.listen(0, '127.0.0.1', () => {
      port = (httpServer.address() as AddressInfo).port;
      console.log(`Test server listening on port ${port}`);
      done();
    });
  }, 10000);

  afterAll((done) => {
    console.log('Cleaning up...');
    
    if (socket?.connected) {
      socket.disconnect();
    }
    
    if (ioServer) {
      ioServer.close();
    }
    
    if (httpServer) {
      httpServer.close(() => {
        console.log('Test server closed');
        done();
      });
    } else {
      done();
    }
  });

  it('should connect and exchange messages', (done) => {
    const socketUrl = `http://localhost:${port}`;
    console.log(`\n=== Starting Test ===`);
    console.log(`1. Connecting to: ${socketUrl}`);
    
    socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false,
      timeout: 5000
    });
    
    const testTimeout = setTimeout(() => {
      console.error('❌ Test timeout');
      console.log('Socket connected:', socket.connected);
      console.log('Socket ID:', socket.id);
      socket.disconnect();
      done(new Error('Test timeout'));
    }, 10000);
    
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      console.log('Socket ID:', socket.id);
      
      const testMessage = { 
        message: 'ping',
        timestamp: Date.now(),
        testId: 'test-' + Math.random().toString(36).substr(2, 9)
      };
      
      console.log('Sending ping:', testMessage);
      socket.emit('ping', testMessage);
      
      socket.on('pong', (response: any) => {
        console.log('Received pong:', response);
        
        try {
          expect(response).toHaveProperty('message', 'ping');
          expect(response).toHaveProperty('testId', testMessage.testId);
          expect(response).toHaveProperty('serverTime');
          
          console.log('✅ Test passed!');
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
  }, 15000);
});
