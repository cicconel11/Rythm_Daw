import { createServer } from 'http';
import { Server } from 'socket.io';
import { Server as WsServer } from 'ws';

export function makeIoServer() {
  const http = createServer();
  
  // Create Socket.IO server
  const io = new Server(http, {
    cors: { 
      origin: '*', 
      methods: ['GET', 'POST'] 
    }
  });
  
  // Create WebSocket server
  const wss = new WsServer({
    server: http,
    path: '/socket.io/'
  });
  
  // Start listening on a random port
  http.listen();
  
  // Store references for cleanup
  (io as any).httpServer = http;
  (io as any).wsServer = wss;
  
  return { io, http };
}
