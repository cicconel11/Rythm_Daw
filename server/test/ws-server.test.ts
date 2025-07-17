import { io, Socket } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';

describe('WebSocket Server', () => {
  let httpServer: ReturnType<typeof createServer>;
  let ioServer: any; // Using any to avoid type issues with Socket.IO v4
  let clientSocket: Socket;
  const PORT = 3001;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create Socket.IO server
    ioServer = new Server(httpServer, {
      cors: {
        origin: '*', // Allow all origins for testing
        methods: ['GET', 'POST']
      }
    });

    // Handle connections
    ioServer.on('connection', (socket: any) => {
      console.log('Client connected');
      
      // Echo back any message
      socket.on('message', (data: any) => {
        console.log('Server received message:', data);
        socket.emit('message', `Echo: ${data}`);
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // Start listening
    httpServer.listen(PORT, () => {
      console.log(`Test WebSocket server running on port ${PORT}`);
      done();
    });
  });

  afterAll(() => {
    // Clean up
    if (ioServer) {
      ioServer.close();
    }
    if (httpServer) {
      httpServer.close();
    }
  });

  afterEach(() => {
    // Disconnect client after each test
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
  });

  test('should connect to WebSocket server', (done) => {
    clientSocket = io(`http://localhost:${PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });

    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  }, 10000);

  test('should send and receive messages', (done) => {
    const testMessage = 'Hello, WebSocket!';
    
    clientSocket = io(`http://localhost:${PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    clientSocket.on('connect', () => {
      console.log('Client connected, sending message...');
      clientSocket.emit('message', testMessage);
    });
    
    clientSocket.on('message', (data: string) => {
      try {
        console.log('Client received message:', data);
        expect(data).toBe(`Echo: ${testMessage}`);
        done();
      } catch (err) {
        done(err);
      }
    });
    
    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  }, 10000);

  test('should handle disconnection', (done) => {
    clientSocket = io(`http://localhost:${PORT}`, {
      transports: ['websocket'],
      reconnection: false,
      forceNew: true,
      timeout: 5000
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      
      clientSocket.on('disconnect', () => {
        expect(clientSocket.connected).toBe(false);
        done();
      });
      
      // Initiate disconnection
      clientSocket.disconnect();
    });
    
    clientSocket.on('connect_error', (err) => {
      done(err);
    });
  }, 10000);
});
