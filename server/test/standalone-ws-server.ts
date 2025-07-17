import { Server, type Socket } from 'socket.io';
import { createServer } from 'http';
import type { Server as HttpServer, AddressInfo } from 'net';

interface ShutdownMessage {
  type: 'shutdown';
}

const httpServer: HttpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Simple echo handler
io.on('connection', (socket) => {
  console.log('Test client connected');
  
  socket.on('echo', (data, callback) => {
    if (typeof callback === 'function') {
      callback({ ...data, timestamp: Date.now() });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Test client disconnected');
  });
});

// Start server on random port
httpServer.listen(0, () => {
  const address = httpServer.address() as AddressInfo;
  if (!address || !address.port) {
    console.error('Failed to get server address or port');
    process.exit(1);
  }
  
  const port = address.port;
  console.log(`Test WebSocket server running on port ${port}`);
  
  // For testing purposes, log the port
  if (process.send) {
    process.send({ port });
  }
});

// Handle graceful shutdown
const shutdown = () => {
  console.log('Shutting down test WebSocket server');
  
  // Close all WebSocket connections
  io.sockets.sockets.forEach(socket => {
    socket.disconnect(true);
  });
  
  // Close the server
  io.close(() => {
    httpServer.close(() => {
      console.log('Test WebSocket server stopped');
      process.exit(0);
    });
  });
};

// Handle process termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Handle parent process messages for graceful shutdown
process.on('message', (message: unknown) => {
  if (typeof message === 'object' && message !== null && 'type' in message) {
    const msg = message as ShutdownMessage;
    if (msg.type === 'shutdown') {
      shutdown();
    }
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  shutdown();
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown();
});

export { io, httpServer };
