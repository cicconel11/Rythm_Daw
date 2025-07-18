const { WebSocket, WebSocketServer } = require('ws');
const { createServer } = require('http');

// Simple WebSocket echo server for testing
function createWebSocketServer(port = 0) {
  const server = createServer();
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket connections
  server.on('upgrade', (request, socket, head) => {
    console.log('WebSocket upgrade request received');
    
    // Simple token validation (in a real app, verify JWT)
    const token = request.headers['sec-websocket-protocol'];
    
    if (!token) {
      console.log('No token provided, rejecting connection');
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }
    
    console.log(`Client connected with token: ${token}`);
    
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  // Handle new connections
  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Echo any message back to the client
    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      ws.send(`Echo: ${message}`);
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Start the server
  return new Promise((resolve) => {
    server.listen(port, () => {
      const address = server.address();
      const port = typeof address === 'string' ? 0 : address.port;
      console.log(`Test WebSocket server listening on port ${port}`);
      resolve({
        port,
        close: () => new Promise((resolveClose) => {
          wss.close(() => {
            server.close(resolveClose);
          });
        })
      });
    });
  });
}

describe('WebSocket Smoke Test', () => {
  let server;
  let port;
  
  beforeAll(async () => {
    // Start the WebSocket server
    server = await createWebSocketServer(0);
    port = server.port;
  }, 10000);
  
  afterAll(async () => {
    // Close the server
    if (server) {
      await server.close();
      console.log('Test WebSocket server closed');
    }
  }, 10000);
  
  test('should connect with a valid token', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`, ['valid-token']);
    
    ws.on('open', () => {
      console.log('WebSocket connection opened');
      ws.close();
      done();
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      done.fail('Failed to connect to WebSocket server');
    });
  }, 10000);
  
  test('should reject connection without a token', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    
    ws.on('open', () => {
      console.log('WebSocket connection opened unexpectedly');
      ws.close();
      done.fail('Connection should have been rejected');
    });
    
    ws.on('error', (error) => {
      console.log('Expected error (connection rejected):', error.message);
      done();
    });
  }, 10000);
  
  test('should echo messages', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`, ['valid-token']);
    const testMessage = 'Hello, WebSocket!';
    
    ws.on('open', () => {
      console.log('WebSocket connection opened for echo test');
      ws.send(testMessage);
    });
    
    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
      expect(message.toString()).toBe(`Echo: ${testMessage}`);
      ws.close();
      done();
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      done.fail('WebSocket error during echo test');
    });
  }, 10000);
});
