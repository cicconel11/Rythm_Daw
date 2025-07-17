import { createServer, Server as HttpServer } from 'http';
import * as WebSocketModule from 'ws';
import { AddressInfo } from 'net';
import WebSocket from 'ws';

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

/**
 * Interface for WebSocket client with additional test helpers
 */
interface TestWebSocketClient extends WebSocketModule {
  /** Unique client ID for testing */
  testId?: string;
  /** List of received messages */
  receivedMessages: any[];
  /** Wait for a specific number of messages */
  waitForMessages: (count: number, timeout?: number) => Promise<void>;
}

/**
 * Helper function to create a test WebSocket client
 */
function createTestClient(url: string, id: string): Promise<TestWebSocketClient> {
  return new Promise((resolve, reject) => {
    const WebSocket = require('ws');
    const client = new WebSocket(url) as TestWebSocketClient;
    client.testId = id;
    client.receivedMessages = [];
    
    // Set up message queue and handlers
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
    
    // Wait for connection
    client.on('open', () => {
      log(`[Client ${id}] Connected to WebSocket server`);
      
      // Add waitForMessages helper
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

/**
 * Helper function to close all test clients
 */
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

describe('WebSocket Server', () => {
  let httpServer: HttpServer;
  let wss: WebSocketModule.Server;
  let serverUrl: string;
  const testClients: TestWebSocketClient[] = [];
  
  // Clean up all test clients after each test
  afterEach(async () => {
    await closeTestClients(...testClients);
    testClients.length = 0; // Clear the array
  });
  
  // Close the server after all tests
  afterAll((done) => {
    if (wss) {
      wss.close(() => {
        if (httpServer) {
          httpServer.close(done);
        } else {
          done();
        }
      });
    } else if (httpServer) {
      httpServer.close(done);
    } else {
      done();
    }
  });
  
  // Set up the WebSocket server before tests
  beforeAll((done) => {
    httpServer = createServer();
    wss = new WebSocketModule.Server({ server: httpServer });
    
    // Handle new connections
    wss.on('connection', (ws: TestWebSocketClient) => {
      log('New WebSocket connection');
      
      // Handle incoming messages
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          log('Received message:', data);
          
          // Echo the message back to the client
          ws.send(JSON.stringify({
            type: 'echo',
            data: message,
            timestamp: new Date().toISOString()
          }));
          
          // Broadcast to all clients if it's a broadcast message
          if (data.type === 'broadcast') {
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WS_OPEN) {
                client.send(JSON.stringify({
                  type: 'broadcast',
                  from: ws.testId || 'unknown',
                  message: data.message,
                  timestamp: new Date().toISOString()
                }));
              }
            });
          }
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });
      
      // Handle client disconnection
      ws.on('close', () => {
        log('Client disconnected');
      });
    });
    
    // Start the server
    httpServer.listen(TEST_PORT, TEST_HOST, () => {
      const address = httpServer.address() as AddressInfo;
      serverUrl = `ws://${TEST_HOST}:${address.port}`;
      log(`Test WebSocket server running on ${serverUrl}`);
      done();
    });
  });
  
  test('should connect to the WebSocket server', async () => {
    const client = await createTestClient(serverUrl, 'test-client-1');
    testClients.push(client);
    
    expect(client.readyState).toBe(WS_OPEN);
    expect(client.testId).toBe('test-client-1');
  });
  
  test('should echo messages back to the client', async () => {
    const client = await createTestClient(serverUrl, 'test-client-2');
    testClients.push(client);
    
    const testMessage = { type: 'test', message: 'Hello, WebSocket!' };
    client.send(JSON.stringify(testMessage));
    
    // Wait for the echo response
    await client.waitForMessages(1);
    
    expect(client.receivedMessages).toHaveLength(1);
    const response = client.receivedMessages[0];
    expect(response.type).toBe('echo');
    expect(JSON.parse(response.data)).toEqual(testMessage);
  });
  
  test('should handle multiple clients', async () => {
    // Create two clients
    const client1 = await createTestClient(serverUrl, 'client-1');
    const client2 = await createTestClient(serverUrl, 'client-2');
    testClients.push(client1, client2);
    
    // Send a broadcast message from client 1
    const broadcastMessage = {
      type: 'broadcast',
      message: 'Hello everyone!',
      from: 'client-1'
    };
    
    client1.send(JSON.stringify(broadcastMessage));
    
    // Wait for client 2 to receive the broadcast
    await client2.waitForMessages(1);
    
    // Client 2 should receive the broadcast
    expect(client2.receivedMessages).toHaveLength(1);
    const receivedMessage = client2.receivedMessages[0];
    expect(receivedMessage.type).toBe('broadcast');
    expect(receivedMessage.from).toBe('client-1');
    expect(receivedMessage.message).toBe('Hello everyone!');
  });
  
  test('should handle client disconnection', async () => {
    const client = await createTestClient(serverUrl, 'disconnect-test');
    testClients.push(client);
    
    // Close the client connection
    client.close();
    
    // Wait a moment for the close to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(client.readyState).toBe(WS_CLOSED);
  });

  // Helper function to generate a random ID for test clients
  function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
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

// Helper function to generate a random ID for test clients
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
