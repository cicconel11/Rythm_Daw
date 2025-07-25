import WebSocket, { Server as WebSocketServer } from 'ws';
import { createServer, Server as HttpServer } from 'http';

describe('WebSocket Integration Tests', () => {
  let httpServer: HttpServer;
  let wss: WebSocketServer;
  let port: number;
  let clients: WebSocket[] = [];

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create WebSocket server
    wss = new WebSocketServer({ server: httpServer });
    
    // Handle WebSocket connections
    wss.on('connection', (ws: WebSocket) => {
      const clientId = Math.random().toString(36).substring(2, 9);
      (ws as unknown as { id: string }).id = clientId;
      
      // Store the WebSocket connection
      clients.push(ws);
      
      // Handle incoming messages
      ws.on('message', (data: unknown) => {
        try {
          const message = (data as Buffer).toString();
          
          // Echo the message back to the client
          ws.send(JSON.stringify({ 
            type: 'echo', 
            data: message,
            clientId,
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          console.error(`[${clientId}] Error handling message:`, err);
        }
      });
      
      // Handle close events
      ws.on('close', () => {
        clients = clients.filter(c => c !== ws);
      });
      
      // Handle errors
      ws.on('error', (error: Error) => {
        console.error(`[${clientId}] WebSocket error:`, error);
        clients = clients.filter(c => c !== ws);
      });
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        timestamp: new Date().toISOString()
      }));
    });
    
    // Start server
    httpServer.listen(0, () => {
      port = (httpServer.address() as any).port;
      done();
    });
  });

  afterAll((done) => {
    // Close all client connections
    clients.forEach(client => {
      try {
        client.close(1000, 'Test complete');
      } catch (err) {
        console.error('Error closing client:', err);
      }
    });
    
    // Close WebSocket server
    wss.close(() => {
      // Close HTTP server
      httpServer.close(() => {
        clients = [];
        console.log('Test teardown complete');
        done();
      });
    });
  });

  it('should handle basic WebSocket communication', (done) => {
    const ws = new WebSocket(`ws://localhost:${port}`);
    
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'test', message: 'Hello' }));
    });
    
    ws.on('message', (data: unknown) => {
      const message = JSON.parse((data as Buffer).toString());
      expect(message.type).toBe('echo');
      expect(message.data).toContain('Hello');
      ws.close();
      done();
    });
    
    ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      done(error);
    });
  });

  it('should handle multiple clients', (done) => {
    const ws1 = new WebSocket(`ws://localhost:${port}`);
    const ws2 = new WebSocket(`ws://localhost:${port}`);
    let messagesReceived = 0;
    
    const checkComplete = () => {
      messagesReceived++;
      if (messagesReceived >= 2) {
        ws1.close();
        ws2.close();
        done();
      }
    };
    
    ws1.on('open', () => {
      ws1.send(JSON.stringify({ type: 'test', message: 'Client 1' }));
    });
    
    ws2.on('open', () => {
      ws2.send(JSON.stringify({ type: 'test', message: 'Client 2' }));
    });
    
    ws1.on('message', (data: unknown) => {
      const message = JSON.parse((data as Buffer).toString());
      expect(message.type).toBe('echo');
      checkComplete();
    });
    
    ws2.on('message', (data: unknown) => {
      const message = JSON.parse((data as Buffer).toString());
      expect(message.type).toBe('echo');
      checkComplete();
    });
    
    ws1.on('error', (error: Error) => {
      console.error('Client 1 error:', error);
      done(error);
    });
    
    ws2.on('error', (error: Error) => {
      console.error('Client 2 error:', error);
      done(error);
    });
  });
});
