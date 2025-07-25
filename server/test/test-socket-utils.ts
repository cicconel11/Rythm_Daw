import { Server as IOServer } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';

export const makeIoServer = () => {
  // Create HTTP server
  const http = createServer();
  
  // Create Socket.IO server with minimal configuration
  const io = new IOServer(http, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    // Use WebSocket transport only for testing
    transports: ['websocket'],
    // Disable HTTP long-polling
    allowEIO3: true
  });
  
  // Start listening on a random port
  const port = 0; // Let the OS assign an available port
  http.listen(port);
  
  // Store the actual port that was assigned
  const address = http.address();
  const actualPort = typeof address === 'string' ? 0 : address?.port || 0;
  
  return { 
    io, 
    http,
    port: actualPort
  };
};

export const closeIoServer = async (io: unknown, http: HttpServer) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Close Socket.IO server
      io.close(() => {
        // Close HTTP server
        http.close(() => {
          resolve();
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
