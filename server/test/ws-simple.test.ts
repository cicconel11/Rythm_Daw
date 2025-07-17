import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HttpServer } from 'http';

describe('WebSocket Server (ws)', () => {
  let server: HttpServer;
  let wss: WebSocketServer;
  let port: number;
  const TEST_TIMEOUT = 5000;

  beforeAll((done) => {
    // Create HTTP server
    server = createServer();
    
    // Create WebSocket server
    wss = new WebSocketServer({ server });
    
    // Handle WebSocket connections
    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      
      // Handle messages from client
      ws.on('message', (message: string) => {
        console.log('Received:', message);
        // Echo the message back
        ws.send(`Echo: ${message}`);
      });
      
      // Handle client disconnection
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
    
    // Start server on random port
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        port = address.port;
        console.log(`Test WebSocket server running on port ${port}`);
        done();
      } else {
        done(new Error('Could not get server port'));
      }
    });
  }, TEST_TIMEOUT);

  afterAll((done) => {
    // Close all WebSocket connections
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });
    
    // Close the WebSocket server
    wss.close(() => {
      // Close the HTTP server
      server.close(() => {
        console.log('Test WebSocket server stopped');
        done();
      });
    });
  });

  test('should connect to the WebSocket server', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      ws.close();
      done();
    });
    
    ws.on('error', (error) => {
      ws.close();
      done(error);
    });
  }, TEST_TIMEOUT);

  test('should echo messages', (done) => {
    const testMessage = 'Hello, WebSocket!';
    const ws = new WebSocket(`ws://localhost:${port}`);
    
    ws.on('open', () => {
      ws.send(testMessage);
    });
    
    ws.on('message', (data) => {
      const response = data.toString();
      expect(response).toBe(`Echo: ${testMessage}`);
      ws.close();
      done();
    });
    
    ws.on('error', (error) => {
      ws.close();
      done(error);
    });
  }, TEST_TIMEOUT);

  test('should handle disconnection', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    
    ws.on('open', () => {
      expect(ws.readyState).toBe(WebSocket.OPEN);
      
      ws.on('close', () => {
        expect(ws.readyState).toBe(WebSocket.CLOSED);
        done();
      });
      
      ws.close();
    });
    
    ws.on('error', (error) => {
      ws.close();
      done(error);
    });
  }, TEST_TIMEOUT);
});
