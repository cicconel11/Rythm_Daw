import { createServer, Server as HttpServer } from 'http';
import * as WebSocketModule from 'ws';

// Import WebSocket client constructor
const WebSocket = require('ws');

// WebSocket readyState constants
const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

// Enable debug logging if DEBUG environment variable is set
const DEBUG = process.env.DEBUG === 'true';
const log = DEBUG ? console.log : () => {};

// Minimal TypeScript types for WebSocket client
interface WebSocketClient {
  send(data: any, cb?: (err?: Error) => void): void;
  close(code?: number, data?: string): void;
  readyState: number;
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  terminate?(): void;
  ping?(data?: any): void;
  pong?(data?: any): void;
  addEventListener?(event: string, listener: (...args: any[]) => void): void;
  removeEventListener?(event: string, listener: (...args: any[]) => void): void;
  id?: string;
}

describe('WebSocket Server', () => {
  let httpServer: HttpServer;
  let wss: WebSocketModule.Server; 
  let clients: WebSocketClient[] = [];
  let serverUrl: string;

  beforeAll((done) => {
    // Increase timeout for setup
    jest.setTimeout(10000);
    
    // Create HTTP server
    httpServer = createServer();
    
    // Start the HTTP server first
    httpServer.listen(0, 'localhost', () => {
      const port = (httpServer.address() as any).port;
      serverUrl = `ws://localhost:${port}`;
      
      // Create WebSocket server after HTTP server is listening
      wss = new WebSocketModule.Server({ server: httpServer });
      console.log(`Test WebSocket server running on ${serverUrl}`);
      
      // Handle WebSocket connections
      wss.on('connection', (ws: WebSocketClient) => {
        const clientId = Math.random().toString(36).substring(2, 9);
        ws.id = clientId; // Store client ID on the socket
        log(`[${clientId}] New client connected`);
        
        // Store the WebSocket connection
        clients.push(ws);
        
        // Handle incoming messages
        const messageHandler = (data: any) => {
          try {
            const message = data.toString();
            log(`[${clientId}] Received message:`, message);
            
            // Skip ping messages
            if (message.includes('"type":"ping"')) {
              log(`[${clientId}] Received ping, ignoring...`);
              return;
            }
            
            // Echo the message back to the client
            if (ws.readyState === WS_OPEN) {
              ws.send(JSON.stringify({ 
                type: 'echo', 
                data: message,
                clientId,
                timestamp: new Date().toISOString()
              }));
            }
          } catch (err) {
            log(`[${clientId}] Error handling message:`, err);
          }
        };
        
        // Handle close events
        const closeHandler = () => {
          log(`[${clientId}] Client disconnected`);
          cleanupClient(ws);
        };
        
        // Handle errors
        const errorHandler = (error: Error) => {
          log(`[${clientId}] WebSocket error:`, error);
          cleanupClient(ws);
        };
        
        // Add event listeners
        if (ws.addEventListener) {
          ws.addEventListener('message', messageHandler);
          ws.addEventListener('close', closeHandler);
          ws.addEventListener('error', errorHandler);
        } else if ('on' in ws) {
          ws.on('message', messageHandler);
          ws.on('close', closeHandler);
          ws.on('error', errorHandler);
        }
        
        // Send welcome message
        if (ws.readyState === WS_OPEN) {
          ws.send(JSON.stringify({
            type: 'connected',
            clientId,
            timestamp: new Date().toISOString()
          }));
        }
        
        // Cleanup function for client
        const cleanupClient = (client: WebSocketClient) => {
          const clientId = client.id || 'unknown';
          try {
            // Remove from clients array
            clients = clients.filter(c => c !== client);
            
            // Remove event listeners
            if (client.removeEventListener) {
              client.removeEventListener('message', messageHandler);
              client.removeEventListener('close', closeHandler);
              client.removeEventListener('error', errorHandler);
            } else if ('off' in client) {
              client.off('message', messageHandler);
              client.off('close', closeHandler);
              client.off('error', errorHandler);
            }
            
            // Close the connection if still open
            if (client.readyState === WS_OPEN) {
              client.close(1000, 'Client disconnected');
            }
          } catch (err) {
            log(`[${clientId}] Error during cleanup:`, err);
          }
        };
      });
      
      done();
    });
  });
  
  afterAll((done) => {
    // Close all client connections
    clients.forEach(client => {
      try {
        if (client.readyState === WS_OPEN) {
          client.close(1000, 'Test complete');
        }
      } catch (err) {
        console.error('Error closing client:', err);
      }
    });
    
    // Close WebSocket server
    if (wss) {
      wss.close(() => {
        // Close HTTP server
        if (httpServer) {
          httpServer.close(() => {
            // Clear the clients array
            clients = [];
            console.log('Test teardown complete');
            done();
          });
        } else {
          done();
        }
      });
    } else if (httpServer) {
      httpServer.close(() => {
        done();
      });
    } else {
      done();
    }
  });
  
  test('should establish WebSocket connection', (done) => {
    // Increase timeout for this test
    jest.setTimeout(10000);
    const client = new WebSocket(serverUrl);
    
    client.on('open', () => {
      try {
        expect(client.readyState).toBe(WS_OPEN);
        client.close(1000, 'Test complete');
      } catch (err) {
        done(err);
      }
    });
    
    client.on('close', () => {
      done();
    });
    
    client.on('error', (err) => {
      done(err);
    });
  });
  
  test('should send and receive messages', (done) => {
    // Increase timeout for this test
    jest.setTimeout(10000);
    const client = new WebSocket(serverUrl);
    const testMessage = JSON.stringify({ type: 'test', data: 'Hello, WebSocket!' });
    
    client.on('open', () => {
      client.send(testMessage);
    });
    
    client.on('message', (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'echo') {
          expect(JSON.parse(message.data)).toEqual(JSON.parse(testMessage));
          client.close();
          done();
        }
      } catch (err) {
        client.close();
        done(err);
      }
    });
    
    client.on('error', (err: any) => {
      console.error('WebSocket error:', err);
      client.close();
      done.fail('WebSocket error occurred');
    });
  });
  
  test('should handle multiple clients', (done) => {
    // Increase timeout for this test
    jest.setTimeout(15000);
    const client1 = new WebSocket(serverUrl);
    const client2 = new WebSocket(serverUrl);
    const testMessage1 = JSON.stringify({ type: 'test', client: 1, data: 'Hello from client 1' });
    const testMessage2 = JSON.stringify({ type: 'test', client: 2, data: 'Hello from client 2' });
    
    let client1Connected = false;
    let client2Connected = false;
    let client1Received = false;
    let client2Received = false;
    
    const checkDone = () => {
      if (client1Received && client2Received) {
        client1.close();
        client2.close();
        done();
      }
    };
    
    client1.on('open', () => {
      client1Connected = true;
      if (client2Connected) {
        client1.send(testMessage1);
        client2.send(testMessage2);
      }
    });
    
    client2.on('open', () => {
      client2Connected = true;
      if (client1Connected) {
        client1.send(testMessage1);
        client2.send(testMessage2);
      }
    });
    
    client1.on('message', (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'echo') {
          const receivedData = JSON.parse(message.data);
          if (receivedData.client === 2) {
            client1Received = true;
            checkDone();
          }
        }
      } catch (err) {
        console.error('Error handling message:', err);
      }
    });
    
    client2.on('message', (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'echo') {
          const receivedData = JSON.parse(message.data);
          if (receivedData.client === 1) {
            client2Received = true;
            checkDone();
          }
        }
      } catch (err) {
        console.error('Error handling message:', err);
      }
    });
    
    client1.on('error', (err: any) => {
      console.error('Client 1 error:', err);
      client1.close();
      client2.close();
      done.fail('Client 1 error');
    });
    
    client2.on('error', (err: any) => {
      console.error('Client 2 error:', err);
      client1.close();
      client2.close();
      done.fail('Client 2 error');
    });
  });
});
