import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HttpServer } from 'http';

describe('WebSocket Smoke Tests (ws)', () => {
  let httpServer: HttpServer;
  let wss: WebSocketServer;
  let port: number;
  const TEST_TIMEOUT = 5000;

  beforeAll((done) => {
    // 1. Create HTTP server
    httpServer = createServer();
    
    // 2. Create WebSocket server
    wss = new WebSocketServer({ server: httpServer });
    
    // 3. Set up connection handler
    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      
      // Handle ping message
      ws.on('message', (message: string) => {
        console.log('Server received:', message);
        const data = JSON.parse(message);
        
        if (data.type === 'ping') {
          ws.send(JSON.stringify({
            type: 'pong',
            message: data.message,
            timestamp: Date.now()
          }));
        } else if (data.type === 'health') {
          ws.send(JSON.stringify({
            type: 'health',
            status: 'ok',
            timestamp: Date.now()
          }));
        }
      });
      
      // Handle client disconnection
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
    
    // Start server on random port
    httpServer.listen(0, () => {
      const address = httpServer.address();
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
    
    // Close the server
    wss.close(() => {
      httpServer.close(() => {
        console.log('Test WebSocket server closed');
        done();
      });
    });
  });

  // 2. Connection testing with validation
  test('should establish WebSocket connection', (done) => {
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

  // 3. Message handling tests
  test('should handle ping-pong messages', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    const testMessage = 'test-ping';
    
    ws.on('open', () => {
      // Send ping message
      ws.send(JSON.stringify({
        type: 'ping',
        message: testMessage
      }));
    });
    
    ws.on('message', (data: string) => {
      try {
        const response = JSON.parse(data);
        expect(response.type).toBe('pong');
        expect(response.message).toBe(testMessage);
        expect(response.timestamp).toBeDefined();
        ws.close();
        done();
      } catch (err) {
        ws.close();
        done(err);
      }
    });
    
    ws.on('error', (error) => {
      ws.close();
      done(error);
    });
  }, TEST_TIMEOUT);

  // 4. Health check
  test('should respond to health check', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    
    ws.on('open', () => {
      // Send health check
      ws.send(JSON.stringify({
        type: 'health'
      }));
    });
    
    ws.on('message', (data: string) => {
      try {
        const response = JSON.parse(data);
        expect(response.type).toBe('health');
        expect(response.status).toBe('ok');
        expect(response.timestamp).toBeDefined();
        ws.close();
        done();
      } catch (err) {
        ws.close();
        done(err);
      }
    });
    
    ws.on('error', (error) => {
      ws.close();
      done(error);
    });
  }, TEST_TIMEOUT);
});
