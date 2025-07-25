import { createServer, Server as HttpServer } from 'http';
import { io as Client, Socket } from 'socket.io-client';
import { Server, Socket as ServerSocket } from 'socket.io';

describe('WebSocket Server', () => {
  let io: Server;
  let httpServer: HttpServer;
  let serverSocket: ServerSocket;
  let clientSocket: Socket;
  const port = 3001;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server with proper typing
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      path: '/socket.io/'
    });
    
    // Listen for connections using the 'on' method directly on the io instance
    io.on('connection', (socket: ServerSocket) => {
      console.log('Client connected:', socket.id);
      serverSocket = socket;
      
      // Handle ping event
      socket.on('ping', (data: unknown, callback: (response: unknown) => void) => {
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
    
    // Start listening
    httpServer.listen(port, () => {
      console.log(`Test server listening on port ${port}`);
      done();
    });
  });

  afterAll((done) => {
    // Close all client connections first
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
    
    // Close the server
    io.close(() => {
      httpServer.close(() => {
        console.log('Test server closed');
        done();
      });
    });
  });

  test('should connect to the server', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      path: '/socket.io/'
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      clientSocket.disconnect();
      done();
    });

    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  });

  test('should handle ping-pong', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      reconnection: false,
      path: '/socket.io/'
    });

    clientSocket.on('connect', () => {
      const testData = { message: 'test-ping' };
      
      clientSocket.emit('ping', testData, (response: unknown) => {
        expect(response).toBeDefined();
        expect(response.message).toBe(testData.message);
        expect(response.timestamp).toBeDefined();
        clientSocket.disconnect();
        done();
      });
    });

    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  });
});
