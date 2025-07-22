import { createServer, Server as HttpServer } from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { AddressInfo } from 'net';

// WebSocket constants for readyState
const WS_OPEN = 1;
const WS_CLOSED = 3;

// Helper function to create a WebSocket client with proper typing
const createWebSocketClient = (url: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
};

describe('WebSocket Connection', () => {
  let wss: WebSocketServer;
  let server: HttpServer;
  let port: number;
  const HOST = '127.0.0.1';

  beforeAll((done) => {
    // Create HTTP server
    server = createServer();
    
    // Create WebSocket server using mock
    wss = new WebSocketServer({ server, clientTracking: true });
    
    // Start server on a random available port
    server.listen(0, HOST, () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        port = address.port;
        console.log(`Test WebSocket server listening on ws://${HOST}:${port}`);
      }
      done();
    });

    // Simple echo server implementation
    wss.on('connection', (ws: WebSocket) => {
      console.log('Server: Client connected');
      
      ws.on('message', (message: any) => {
        const msg = message.toString();
        console.log('Server received:', msg);
        
        if (ws.readyState === WS_OPEN) {
          console.log('Server sending echo:', msg);
          try {
            ws.send(msg, (error) => {
              if (error) {
                console.error('Server send error:', error);
              } else {
                console.log('Server echo sent successfully');
              }
            });
          } catch (error) {
            console.error('Server send exception:', error);
          }
        } else {
          console.log('Server cannot echo - connection not open. State:', ws.readyState);
        }
      });
      
      ws.on('pong', () => {
        console.log('Server: received pong');
      });
      
      ws.on('close', () => {
        console.log('Server: Client disconnected');
      });
      
      ws.on('error', (error) => {
        console.error('Server WebSocket error:', error);
      });
      
      // Send a ping to verify the connection
      if (ws.readyState === WS_OPEN) {
        console.log('Server: Sending ping to client');
        ws.ping();
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
        server.close(() => {
          done();
        });
      });
    } else {
      server.close(() => {
        done();
      });
    }
  });

  test('should establish WebSocket connection', async () => {
    const ws = await createWebSocketClient(`ws://${HOST}:${port}`);
    expect(ws.readyState).toBe(WebSocket.OPEN);
    ws.close();
  });

  test('should echo messages back to client', async () => {
    const ws = await createWebSocketClient(`ws://${HOST}:${port}`);
    const testMessage = 'Hello, WebSocket!';
    
    return new Promise<void>((resolve, reject) => {
      ws.on('message', (data) => {
        const received = data.toString();
        expect(received).toBe(testMessage);
        ws.close();
        resolve();
      });
      
      ws.on('error', reject);
      
      ws.send(testMessage);
    });
  });

  test('should handle multiple clients', async () => {
    const client1 = await createWebSocketClient(`ws://${HOST}:${port}`);
    const client2 = await createWebSocketClient(`ws://${HOST}:${port}`);
    
    expect(client1.readyState).toBe(WebSocket.OPEN);
    expect(client2.readyState).toBe(WebSocket.OPEN);
    
    client1.close();
    client2.close();
  });

  test('should handle connection close', async () => {
    const ws = await createWebSocketClient(`ws://${HOST}:${port}`);
    
    return new Promise<void>((resolve) => {
      ws.on('close', () => {
        expect(ws.readyState).toBe(WebSocket.CLOSED);
        resolve();
      });
      
      ws.close();
    });
  });
});
