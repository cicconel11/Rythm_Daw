import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';

describe('Basic WebSocket Test', () => {
  let io: Server;
  let httpServer: ReturnType<typeof createServer>;
  let clientSocket: ReturnType<typeof Client>;
  const port = 3001;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    io = new Server(httpServer);
    
    // Listen for connections
    io.on('connection', (socket: unknown) => {
      console.log('Client connected:', (socket as any).id);
      
      // Handle ping event
      (socket as any).on('ping', (data: unknown, callback: (response: unknown) => void) => {
        console.log('Server received ping:', data);
        callback({ ...(data as object), timestamp: Date.now() });
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
      
      clientSocket.emit('ping', testData, (response: unknown) => {
        expect(response).toBeDefined();
        expect((response as any).message).toBe(testData.message);
        expect((response as any).timestamp).toBeDefined();
        done();
      });
    });
    
    clientSocket.on('connect_error', (err: unknown) => {
      done(err as Error);
    });
  });
});
