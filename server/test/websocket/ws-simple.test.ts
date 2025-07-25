import { Server as WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HttpServer } from 'http';

describe('WebSocket Simple Tests', () => {
  let httpServer: HttpServer;
  let wss: WebSocketServer;
  let port: number;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create WebSocket server using mock
    wss = new WebSocketServer({ server: httpServer });
    
    // Handle connections
    wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: unknown) => {
        const data = message.toString();
        ws.send(`Echo: ${data}`);
      });
    });
    
    // Start server
    httpServer.listen(0, () => {
      const address = httpServer.address();
      if (address && typeof address !== 'string') {
        port = address.port;
        done();
      } else {
        done(new Error('Could not get server port'));
      }
    });
  });

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

  test('should establish connection', (done) => {
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
  });

  test('should echo messages', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    const testMessage = 'Hello, WebSocket!';
    
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
  });
});
