import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';

describe('Basic WebSocket Test', () => {
  let io: any;
  let httpServer: any;
  let clientSocket: any;
  const port = 3001;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    io = new Server(httpServer);
    
    // Listen for connections
    io.on('connection', (socket: any) => {
      console.log('Client connected:', socket.id);
      
      // Handle ping event
      socket.on('ping', (data: any, callback: Function) => {
        console.log('Server received ping:', data);
        callback({ ...data, timestamp: Date.now() });
      });
    });
    
    // Start listening
    httpServer.listen(port, () => {
      console.log(`Test server listening on port ${port}`);
      done();
    });
  });

  afterAll(() => {
    if (io) io.close();
    if (httpServer) httpServer.close();
    if (clientSocket) clientSocket.disconnect();
  });

  test('should connect and send/receive messages', (done) => {
    // Create client
    clientSocket = Client(`http://localhost:${port}`);
    
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      
      const testData = { message: 'test' };
      
      clientSocket.emit('ping', testData, (response: any) => {
        expect(response).toBeDefined();
        expect(response.message).toBe(testData.message);
        expect(response.timestamp).toBeDefined();
        done();
      });
    });
    
    clientSocket.on('connect_error', (err: any) => {
      done(err);
    });
  });
});
