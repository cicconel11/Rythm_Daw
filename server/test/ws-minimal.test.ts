import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';

describe('Minimal WebSocket Test', () => {
  let httpServer: any;
  let io: any;
  let port: number;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    io = new Server(httpServer);
    
    // Start listening on a random port
    httpServer.listen(0, () => {
      port = httpServer.address().port;
      console.log(`Test server listening on port ${port}`);
      done();
    });
  });

  afterAll((done) => {
    // Close everything
    io.close();
    httpServer.close(() => {
      console.log('Test server closed');
      done();
    });
  });

  test('should handle client connection', (done) => {
    // Set up server-side handler using the 'sockets' namespace
    io.sockets.on('connection', (socket: any) => {
      console.log('Client connected:', socket.id);
      
      // Handle ping event
      socket.on('ping', (data: any, callback: Function) => {
        console.log('Server received ping:', data);
        if (typeof callback === 'function') {
          callback({ ...data, timestamp: Date.now() });
        }
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    // Create client with explicit options
    const client = Client(`http://localhost:${port}`, {
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
      client.emit('ping', testData, (response: any) => {
        try {
          expect(response).toBeDefined();
          expect(response.message).toBe(testData.message);
          expect(response.timestamp).toBeDefined();
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
    
    client.on('connect_error', (err: any) => {
      clearTimeout(testTimeout);
      client.disconnect();
      done(err);
    });
    
    client.on('disconnect', () => {
      console.log('Client disconnected from server');
    });
  });
});
