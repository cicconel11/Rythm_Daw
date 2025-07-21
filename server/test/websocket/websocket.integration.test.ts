import WebSocket, { Server as WebSocketServer } from 'ws';
import { createServer, Server as HttpServer } from 'http';
import { AddressInfo } from 'net';

// WebSocket readyState constants
const WS_CONNECTING = 0;
const WS_OPEN = 1;
const WS_CLOSING = 2;
const WS_CLOSED = 3;

// Test configuration
const TEST_PORT = 0; // 0 means random available port
const TEST_HOST = 'localhost';
const MESSAGE_TIMEOUT = 5000; // 5 seconds

// Enable debug logging if DEBUG environment variable is set
const DEBUG = process.env.DEBUG === 'true';
const log = DEBUG ? console.log : () => {};

interface TestWebSocketClient extends WebSocket {
  testId?: string;
  receivedMessages: any[];
  waitForMessages: (count: number, timeout?: number) => Promise<void>;
}

function createTestClient(url: string, id: string): Promise<TestWebSocketClient> {
  return new Promise((resolve, reject) => {
    const client = new WebSocket(url) as TestWebSocketClient;
    client.testId = id;
    client.receivedMessages = [];
    
    let messageResolvers: Array<() => void> = [];
    
    client.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);
        client.receivedMessages.push(message);
        
        // Resolve any waiting message promises
        while (messageResolvers.length > 0) {
          const resolver = messageResolvers.shift();
          if (resolver) resolver();
        }
      } catch (error) {
        console.error(`[Client ${id}] Error parsing message:`, error);
      }
    });
    
    client.on('open', () => {
      log(`[Client ${id}] Connected to WebSocket server`);
      
      client.waitForMessages = (count: number, timeout = MESSAGE_TIMEOUT) => {
        return new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error(`Timeout waiting for ${count} messages`));
          }, timeout);
          
          const checkMessages = () => {
            if (client.receivedMessages.length >= count) {
              clearTimeout(timer);
              resolve();
            } else {
              messageResolvers.push(checkMessages);
            }
          };
          
          checkMessages();
        });
      };
      
      resolve(client);
    });
    
    client.on('error', (error) => {
      console.error(`[Client ${id}] WebSocket error:`, error);
      reject(error);
    });
  });
}

async function closeTestClients(...clients: TestWebSocketClient[]): Promise<void> {
  await Promise.all(
    clients.map(
      (client) =>
        new Promise<void>((resolve) => {
          if (client.readyState === WS_OPEN) {
            client.close(1000, 'Test complete');
          }
          resolve();
        })
    )
  );
}

describe('WebSocket Integration Tests', () => {
  let httpServer: HttpServer;
  let wss: WebSocketServer;
  let port: number;
  const TEST_TIMEOUT = 5000;

  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create WebSocket server using mock
    wss = new WebSocketServer({ server: httpServer });
    
    // Handle WebSocket connections
    wss.on('connection', (ws: WebSocket) => {
      const clientId = Math.random().toString(36).substring(2, 9);
      (ws as any).id = clientId;
      
      // Store the WebSocket connection
      (wss as any).clients = (wss as any).clients || new Set();
      (wss as any).clients.add(ws);
      
      // Handle incoming messages
      ws.on('message', (data: any) => {
        try {
          const message = data.toString();
          
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
        (wss as any).clients.delete(ws);
      });
      
      // Handle errors
      ws.on('error', (error: Error) => {
        console.error(`[${clientId}] WebSocket error:`, error);
        (wss as any).clients.delete(ws);
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
    if ((wss as any).clients) {
      (wss as any).clients.forEach((client: WebSocket) => {
        try {
          client.close(1000, 'Test complete');
        } catch (err) {
          console.error('Error closing client:', err);
        }
      });
    }
    
    // Close WebSocket server
    wss.close(() => {
      // Close HTTP server
      httpServer.close(() => {
        (wss as any).clients = [];
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
    
    ws.on('message', (data: any) => {
      const message = JSON.parse(data.toString());
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
    const client1 = new WebSocket(`ws://localhost:${port}`);
    const client2 = new WebSocket(`ws://localhost:${port}`);
    let messagesReceived = 0;
    
    const checkComplete = () => {
      messagesReceived++;
      if (messagesReceived >= 2) {
        client1.close();
        client2.close();
        done();
      }
    };
    
    client1.on('open', () => {
      client1.send(JSON.stringify({ type: 'test', message: 'Client 1' }));
    });
    
    client2.on('open', () => {
      client2.send(JSON.stringify({ type: 'test', message: 'Client 2' }));
    });
    
    client1.on('message', (data: any) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('echo');
      checkComplete();
    });
    
    client2.on('message', (data: any) => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('echo');
      checkComplete();
    });
    
    client1.on('error', (error: Error) => {
      console.error('Client 1 error:', error);
      done(error);
    });
    
    client2.on('error', (error: Error) => {
      console.error('Client 2 error:', error);
      done(error);
    });
  });
});
