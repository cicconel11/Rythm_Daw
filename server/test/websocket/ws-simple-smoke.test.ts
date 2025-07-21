import WebSocket, { Server as WebSocketServer } from 'ws';
import { createServer, Server as HttpServer } from 'http';

describe('WebSocket Smoke Tests (ws)', () => {
  let httpServer: HttpServer;
  let wss: WebSocketServer;
  let port: number;
  const TEST_TIMEOUT = 5000;

  beforeAll((done) => {
    // 1. Create HTTP server
    httpServer = createServer();
    
    // 2. Create WebSocket server using mock
    wss = new WebSocketServer({ server: httpServer });
    
    // 3. Set up connection handler
    wss.on('connection', (ws: WebSocket) => {
      // Handle ping message
      ws.on('message', (message: string) => {
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
    });
    
    // Start server on random port
    httpServer.listen(0, () => {
      const address = httpServer.address();
      if (address && typeof address !== 'string') {
        port = address.port;
        done();
      } else {
        done(new Error('Could not get server port'));
      }
    });
  }, TEST_TIMEOUT);

  afterAll((done) => {
    // Close all WebSocket connections
    if (wss && wss.clients) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.close();
        }
      });
    }
    
    // Close the server
    if (wss) {
      wss.close(() => {
        httpServer.close(() => {
          done();
        });
      });
    } else {
      httpServer.close(() => {
        done();
      });
    }
  });

  // 2. Connection testing with validation
  test('should establish WebSocket connection', (done) => {
    const wsClient = new WebSocket(`ws://localhost:${port}`);
    
    wsClient.on('open', () => {
      expect(wsClient.readyState).toBe(WebSocket.OPEN);
      wsClient.close();
      done();
    });
    
    wsClient.on('error', (error) => {
      wsClient.close();
      done(error);
    });
  }, TEST_TIMEOUT);

  // 3. Message handling tests
  test('should handle ping-pong messages', (done) => {
    const wsClient = new WebSocket(`ws://localhost:${port}`);
    const testMessage = 'test-ping';
    
    wsClient.on('open', () => {
      // Send ping message
      wsClient.send(JSON.stringify({
        type: 'ping',
        message: testMessage
      }));
    });
    
    wsClient.on('message', (data) => {
      const response = JSON.parse(data.toString());
      expect(response.type).toBe('pong');
      expect(response.message).toBe(testMessage);
      expect(response.timestamp).toBeDefined();
      wsClient.close();
      done();
    });
    
    wsClient.on('error', (error) => {
      wsClient.close();
      done(error);
    });
  }, TEST_TIMEOUT);

  // 4. Health check test
  test('should handle health check messages', (done) => {
    const wsClient = new WebSocket(`ws://localhost:${port}`);
    
    wsClient.on('open', () => {
      wsClient.send(JSON.stringify({
        type: 'health'
      }));
    });
    
    wsClient.on('message', (data) => {
      const response = JSON.parse(data.toString());
      expect(response.type).toBe('health');
      expect(response.status).toBe('ok');
      expect(response.timestamp).toBeDefined();
      wsClient.close();
      done();
    });
    
    wsClient.on('error', (error) => {
      wsClient.close();
      done(error);
    });
  }, TEST_TIMEOUT);
});
