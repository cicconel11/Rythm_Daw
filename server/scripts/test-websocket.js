const { Server } = require('http');
const { AddressInfo } = require('net');
const { io } = require('socket.io-client');
const { Server: SocketIOServer } = require('socket.io');

// Configuration
const PORT = 0; // Let the OS assign a free port
const HOST = '127.0.0.1';

// Create HTTP server
const httpServer = new Server();

// Create Socket.IO server
const ioServer = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  connectTimeout: 10000,
  pingTimeout: 10000,
  pingInterval: 25000,
});

// Track connections
const connections = new Set();

// Handle server errors
httpServer.on('error', (error) => {
  console.error('HTTP server error:', error);
});

ioServer.on('connection', (client) => {
  console.log(`\n[Server] Client connected: ${client.id}`);
  connections.add(client);

  client.on('ping', (data) => {
    console.log(`[Server] Received ping from ${client.id}:`, data);
    client.emit('pong', { 
      ...data, 
      serverTime: Date.now(),
      clientId: client.id
    });
  });

  client.on('disconnect', (reason) => {
    console.log(`[Server] Client ${client.id} disconnected:`, reason);
    connections.delete(client);
  });

  client.on('error', (error) => {
    console.error(`[Server] Error from client ${client.id}:`, error);
  });
});

// Start the server
httpServer.listen(PORT, HOST, () => {
  const { port } = httpServer.address();
  console.log(`[Server] Test server listening on http://${HOST}:${port}`);
  
  // Run the client test
  runClientTest(port);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  
  // Close all client connections
  connections.forEach(client => {
    client.disconnect(true);
  });
  
  // Close the server
  ioServer.close(() => {
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});

// Client test function
function runClientTest(serverPort) {
  const socketUrl = `http://${HOST}:${serverPort}`;
  console.log(`\n[Client] Connecting to ${socketUrl}...`);
  
  const socket = io(socketUrl, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: false,
    timeout: 5000
  });
  
  // Set test timeout
  const testTimeout = setTimeout(() => {
    console.error('[Client] ❌ Test timeout');
    console.log('[Client] Connected:', socket.connected);
    console.log('[Client] Socket ID:', socket.id);
    socket.disconnect();
    process.exit(1);
  }, 10000);
  
  // Event handlers
  socket.on('connect', () => {
    console.log('[Client] ✅ Connected to server');
    console.log('[Client] Socket ID:', socket.id);
    
    const testMessage = { 
      message: 'ping',
      timestamp: Date.now(),
      testId: 'test-' + Math.random().toString(36).substr(2, 9)
    };
    
    console.log('[Client] Sending ping:', testMessage);
    socket.emit('ping', testMessage);
  });
  
  socket.on('pong', (response) => {
    console.log('[Client] Received pong:', response);
    
    try {
      if (!response.message || response.message !== 'ping') {
        throw new Error('Invalid message in response');
      }
      if (!response.testId) {
        throw new Error('Missing testId in response');
      }
      if (!response.serverTime) {
        throw new Error('Missing serverTime in response');
      }
      
      console.log('[Client] ✅ Test passed!');
      clearTimeout(testTimeout);
      socket.disconnect();
      process.exit(0);
    } catch (error) {
      console.error('[Client] ❌ Test failed:', error.message);
      clearTimeout(testTimeout);
      socket.disconnect();
      process.exit(1);
    }
  });
  
  socket.on('connect_error', (error) => {
    console.error('[Client] ❌ Connection error:', error.message);
    clearTimeout(testTimeout);
    process.exit(1);
  });
  
  socket.on('error', (error) => {
    console.error('[Client] ❌ Socket error:', error.message);
    clearTimeout(testTimeout);
    process.exit(1);
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`[Client] Disconnected: ${reason}`);
  });
}
