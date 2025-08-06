import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';

describe('Minimal WebSocket Test', () => {
  let httpServer: unknown;
  let io: unknown;
  let _port: number;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    io = new Server(httpServer as any);
    
    // Start listening on a random port
    (httpServer as any).listen(0, () => {
      _port = (httpServer as any).address().port;
      console.log(`Test server listening on port ${_port}`);
      done();
    });
  });

  afterAll((done) => {
    // Close everything
    (io as any).close();
    (httpServer as any).close(() => {
      console.log('Test server closed');
      done();
    });
  });

  test('should handle client connection', (done) => {
    // Set up server-side handler using the 'sockets' namespace
    (io as any).sockets.on('connection', (socket: unknown) => {
      const _socket = socket as any;
      console.log('Client connected:', _socket.id);
      
      // Handle ping event
      (socket as any).on('ping', (data: unknown, callback: (arg: unknown) => void) => {
        const _data = data as any;
        console.log('Server received ping:', _data);
        if (typeof callback === 'function') {
          callback({ ..._data, timestamp: Date.now() });
        }
      });
      
      // Handle disconnection
      (socket as any).on('disconnect', () => {
        console.log('Client disconnected:', _socket.id);
      });
    });

    // Create client with explicit options
    const client = Client(`http://localhost:${_port}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true
    });
    
    // Set a timeout for the test
    const testTimeout = setTimeout(() => {
      client.disconnect();
      done(new Error('Test timeout'));
    }, 5000);
    
    client.on('connect', () => {
      console.log('Client connected to server');
      
      // Test ping-pong
      const testData = { message: 'test' };
      (client as any).emit('ping', testData, (response: unknown) => {
        try {
          const _response = response as any;
          expect(_response).toBeDefined();
          expect(_response.message).toBe(testData.message);
          expect(_response.timestamp).toBeDefined();
          clearTimeout(testTimeout);
          client.disconnect();
          done();
        } catch (err) {
          clearTimeout(testTimeout);
          client.disconnect();
          done(err);
        }
      });
    });
    
    (client as any).on('connect_error', (err: unknown) => {
      const _err = err as any;
      clearTimeout(testTimeout);
      client.disconnect();
      done(_err);
    });
    
    client.on('disconnect', () => {
      console.log('Client disconnected from server');
    });
  });
});
