import * as WebSocketModule from 'ws';
import { createServer, Server as HttpServer } from 'http';
import * as jwt from 'jsonwebtoken';

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

// Minimal TypeScript types for CloseEvent
declare class CloseEvent {
  readonly code: number;
  readonly reason: string;
  readonly wasClean: boolean;
  constructor(type: string, eventInitDict?: CloseEventInit);
}

interface CloseEventInit {
  code?: number;
  reason?: string;
  wasClean?: boolean;
}

interface MessageEvent<T = any> {
  readonly data: T;
  readonly type: string;
  readonly target: any;
}

interface WebSocketClient {
  readonly readyState: number;
  send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void;
  close(code?: number, reason?: string): void;
  onopen: ((this: WebSocketClient, ev: Event) => any) | null;
  onerror: ((this: WebSocketClient, ev: Event) => any) | null;
  onclose: ((this: WebSocketClient, ev: CloseEvent) => any) | null;
  onmessage: ((this: WebSocketClient, ev: MessageEvent) => any) | null;
  terminate?(): void;
  addEventListener?(type: string, listener: (event: any) => void, options?: any): void;
  removeEventListener?(type: string, listener: (event: any) => void, options?: any): void;
}

interface WebSocketServer extends WebSocketModule.Server {
  close(cb?: (err?: Error) => void): void;
}

// Use the WebSocket type from the ws module
type WebSocket = WebSocketModule.WebSocket;

// Create a type for the WebSocket constructor
type WebSocketConstructor = new (url: string, protocols?: string | string[]) => WebSocket;

const TEST_PORT = 3001;
const JWT_SECRET = 'test-secret';

// Enable WebSocket debug logging
const debug = process.env.DEBUG === 'true';
const log = (...args: any[]) => debug && console.log('[WebSocket Test]', ...args);

// Helper function to create a WebSocket client
const createWebSocketClient = (url: string, protocols?: string | string[]): Promise<WebSocketClient & { id?: string }> => {
  return new Promise<WebSocketClient & { id?: string }>((resolve, reject) => {
    log(`Connecting to ${url}...`);
    
    // Use the WebSocket module's WebSocket constructor
    const WS = WebSocketModule.WebSocket || (WebSocketModule as any).default?.WebSocket;
    if (!WS) {
      throw new Error('WebSocket constructor not found');
    }
    
    const client = new WS(url, protocols) as WebSocketClient & { id?: string };
    client.id = Math.random().toString(36).substring(2, 9);
    
    const openTimeout = setTimeout(() => {
      log(`[${client.id}] Connection timeout`);
      cleanupClient();
      reject(new Error('Connection timeout'));
    }, 5000);
    
    const cleanupClient = () => {
      clearTimeout(openTimeout);
      client.onopen = null;
      client.onerror = null;
      client.onclose = null;
      
      if (client.readyState === WS_OPEN) {
        try {
          if ('terminate' in client && typeof client.terminate === 'function') {
            client.terminate();
          } else if (typeof client.close === 'function') {
            client.close();
          }
        } catch (err) {
          log(`[${client.id}] Error during client termination:`, err);
        }
      }
    };
    
    // Set up event handlers
    client.onopen = () => {
      log(`[${client.id}] Connection established`);
      clearTimeout(openTimeout);
      resolve(client);
    };
    
    client.onerror = (event: Event) => {
      log(`[${client.id}] Connection error:`, event);
      cleanupClient();
      reject(new Error('WebSocket connection error'));
    };
    
    client.onclose = () => {
      log(`[${client.id}] Connection closed`);
      cleanupClient();
    };
    
    // Clean up function for intervals
    const intervals: NodeJS.Timeout[] = [];
    const clearAllIntervals = () => {
      intervals.forEach(interval => clearInterval(interval));
      intervals.length = 0;
    };
    
    // Add a small heartbeat to keep the connection alive
    const heartbeatInterval = setInterval(() => {
      try {
        if (client.readyState === WS_OPEN) {
          client.send(JSON.stringify({ type: 'ping' }));
        } else {
          clearInterval(heartbeatInterval);
        }
      } catch (err) {
        log(`[${client.id}] Error in heartbeat:`, err);
        clearInterval(heartbeatInterval);
      }
    }, 10000);
    intervals.push(heartbeatInterval);
    
    // Clean up on close
    const originalClose = client.close;
    client.close = function(...args: any[]) {
      clearAllIntervals();
      if (typeof originalClose === 'function') {
        return originalClose.apply(this, args as any);
      }
    };
  });
};

// Increase test timeout to 30 seconds
jest.setTimeout(30000);

describe('WebSocket Connection', () => {
  let httpServer: HttpServer;
  let wss: any; // Using any to avoid type issues with ws.Server
  let clients: WebSocketClient[] = [];
  
  // WebSocket readyState constants - must match WebSocket.CONNECTING, etc.
  const WS_CONNECTING = 0; // WebSocket.CONNECTING
  const WS_OPEN = 1;       // WebSocket.OPEN
  const WS_CLOSING = 2;    // WebSocket.CLOSING
  const WS_CLOSED = 3;     // WebSocket.CLOSED
  
  beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    
    // Create WebSocket server
    const WSServer = (WebSocketModule as any).Server || (WebSocketModule as any).default?.Server;
    if (!WSServer) {
      throw new Error('WebSocket Server constructor not found');
    }
    
    // Start the HTTP server
    httpServer.listen(0, 'localhost', () => {
      const port = (httpServer.address() as any).port;
      console.log(`Test WebSocket server running on port ${port}`);
      
      // Create WebSocket server
      wss = new WSServer({ server: httpServer });
      
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
              log(`[${clientId}] Received ping message, ignoring`);
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
        
        // Cleanup function for client
        const cleanupClient = (client: any) => {
          const clientId = (client as any).id || 'unknown';
          try {
            // Remove from clients array
            clients = clients.filter(c => c !== client);
            
            // Close the connection if still open
            if (client.readyState === WS_OPEN) {
              client.close();
            }
          } catch (err) {
            log(`[${clientId}] Error during cleanup:`, err);
          }
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
        
        // Set up ping/pong for connection health
        const pingInterval = setInterval(() => {
          if (ws.readyState === WS_OPEN) {
            try {
              ws.ping();
            } catch (err) {
              log(`[${clientId}] Error sending ping:`, err);
              cleanupClient(ws);
              log(`[${clientId}] Error sending response:`, err);
            } else {
              log(`[${clientId}] Response sent successfully`);
            }
          });
        } catch (err) {
          log(`[${clientId}] Error handling message:`, err);
        }
      };
      
      const closeHandler = () => {
        log(`[${clientId}] Client disconnected`);
        cleanupClient(ws);
      };
      
      const errorHandler = (error: Error) => {
        log(`[${clientId}] WebSocket error:`, error);
        cleanupClient(ws);
      };
      
      const cleanupClient = (wsClient: WebSocketClient) => {
        try {
          if (wsClient.removeEventListener) {
            wsClient.removeEventListener('message', messageHandler as any);
            wsClient.removeEventListener('close', closeHandler as any);
            wsClient.removeEventListener('error', errorHandler as any);
          } else if ('removeListener' in wsClient) {
            (wsClient as any).removeListener('message', messageHandler);
            (wsClient as any).removeListener('close', closeHandler);
            (wsClient as any).removeListener('error', errorHandler);
          }
          
          clients = clients.filter(c => c !== wsClient);
          
          if (wsClient.readyState === WS_OPEN) {
            wsClient.close();
          }
        } catch (err) {
          log(`[${clientId}] Error during cleanup:`, err);
        }
      };
      
      // Set up ping/pong for connection health
      const pingInterval = setInterval(() => {
        if (ws.readyState === WS_OPEN) {
          try {
            ws.ping();
          } catch (err) {
            log(`[${clientId}] Error sending ping:`, err);
            cleanupClient(ws);
          }
        } else {
          clearInterval(pingInterval);
        }
      }, 10000);
      
      ws.on('pong', () => {
        log(`[${clientId}] Received pong`);
      });
      
      // Add event listeners using both addEventListener and on* properties
      if (ws.addEventListener) {
        ws.addEventListener('message', messageHandler);
        ws.addEventListener('close', closeHandler);
        ws.addEventListener('error', errorHandler);
      } else if ('on' in ws) {
        (ws as any).on('message', messageHandler);
        (ws as any).on('close', closeHandler);
        (ws as any).on('error', errorHandler);
      }
      
      // Add to clients array
      clients.push(ws);
      log(`[${clientId}] Client connected. Total clients: ${clients.length}`);
      
      // Send welcome message
      ws.send(JSON.stringify({ type: 'connected', clientId }));
    });
  });

  afterEach(() => {
    // Close all client connections after each test
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });
    clients = [];
  });

  afterAll((done) => {
    console.log('Starting test teardown...');
    
    // Close all client connections first
    const closePromises = clients.map((client, index) => {
      return new Promise<void>((resolve) => {
        try {
          if (client.readyState === WS_OPEN) {
            console.log(`Closing client ${index}...`);
            
            const onClose = () => {
              console.log(`Client ${index} closed`);
              resolve();
            };
            
            if (client.onclose) {
              const originalOnClose = client.onclose;
              client.onclose = (event) => {
                if (originalOnClose) originalOnClose.call(client, event);
                onClose();
              };
            } else if (client.addEventListener) {
              client.addEventListener('close', onClose as any);
            } else {
              onClose();
            }
            
            try {
              client.close();
            } catch (err) {
              console.error(`Error closing client ${index}:`, err);
              resolve();
            }
          } else {
            console.log(`Client ${index} already closed (state: ${client.readyState})`);
            resolve();
          }
        } catch (err) {
          console.error(`Error in client ${index} teardown:`, err);
          resolve();
        }
      });
    });
    
    // Set a timeout for the entire teardown process
    const teardownTimeout = setTimeout(() => {
      console.warn('Forcing test teardown due to timeout');
      });
    });
  }
  
  // Clear any remaining timeouts/intervals
  jest.clearAllTimers();
});

// ...

test('should establish WebSocket connection', (done) => {
  const client = new (WebSocketModule as any)(`ws://localhost:${wss.address().port}`);
  
  client.on('open', () => {
    try {
      expect(client.readyState).toBe(WS_OPEN);
      client.close();
      done();
    } catch (err) {
      done(err);
    }
  });
  
  client.on('error', (err: any) => {
    console.error('WebSocket error:', err);
    done.fail('WebSocket connection failed');
  });
});

// ...

test('should send and receive messages', async () => {
  const client = await createWebSocketClient(`ws://localhost:${TEST_PORT}`);
  const testMessage = 'Hello, WebSocket!';
  
  try {
    const messagePromise = new Promise<void>((resolve, reject) => {
      log(`[${client.id}] Setting up message handler...`);
      
      const cleanup = () => {
        client.onmessage = null;
        client.onerror = null;
        clearTimeout(timeoutId);
      };
      
      const messageHandler = (event: MessageEvent) => {
        try {
          const received = event.data.toString();
          log(`[${client.id}] Received message:`, received);
          
          // Skip ping messages
          if (received.includes('"type":"ping"')) {
            log(`[${client.id}] Received ping, ignoring...`);
            return;
        
        const cleanup = () => {
          client.onmessage = null;
          client.onerror = null;
          clearTimeout(timeoutId);
        };
        
        const messageHandler = (event: MessageEvent) => {
          try {
            const received = event.data.toString();
            log(`[${client.id}] Received message:`, received);
            
            // Skip ping messages
            if (received.includes('"type":"ping"')) {
              log(`[${client.id}] Received ping, ignoring...`);
              return;
            }
            
            expect(received).toBe(`Echo: ${testMessage}`);
            cleanup();
            resolve();
          } catch (err) {
            log(`[${client.id}] Error in message handler:`, err);
            cleanup();
            reject(err);
          }
        };
        
        const errorHandler = (event: Event) => {
          log(`[${client.id}] WebSocket error:`, event);
          cleanup();
          reject(new Error('WebSocket error occurred'));
        };
        
        client.onmessage = messageHandler;
        client.onerror = errorHandler;
        
        // Send message with retry logic
        const sendMessage = () => {
          if (client.readyState === WS_OPEN) {
            log(`[${client.id}] Sending test message:`, testMessage);
            client.send(testMessage);
          } else {
            log(`[${client.id}] Client not ready, waiting for open event...`);
            const openHandler = () => {
              client.onopen = null;
              log(`[${client.id}] Client now open, sending message...`);
              client.send(testMessage);
            };
            client.onopen = openHandler;
          }
        };
        
        // Add a small delay before sending to ensure connection is established
        const sendTimeout = setTimeout(sendMessage, 100);
        
        // Set a timeout for the test
        const timeoutId = setTimeout(() => {
          log(`[${client.id}] Test timeout waiting for message`);
          cleanup();
          reject(new Error('Test timeout: Message not received'));
        }, 5000);
      });
      
      await messagePromise;
    } finally {
      if (client.readyState === WS_OPEN) {
        client.close();
      }
    }
  }, 10000);

  it('should handle client disconnection', async () => {
    const client = await createWebSocketClient(`ws://localhost:${TEST_PORT}`);
    
    const closePromise = new Promise<void>((resolve) => {
      const closeHandler = () => {
        client.onclose = null;
        expect(client.readyState).toBe(WS_CLOSED);
        resolve();
      };
      
      client.onclose = closeHandler;
      
      // Add a small delay before closing to ensure connection is established
      setTimeout(() => {
        client.close();
      }, 100);
    });
    
    await closePromise;
  }, 10000);

  it('should handle multiple concurrent connections', async () => {
    const testMessage1 = 'Hello from client 1';
    const testMessage2 = 'Hello from client 2';
    
    log('Creating WebSocket clients...');
    
    // Create two clients with a timeout
    const createClients = async () => {
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Client connection timeout')), 5000);
      });
      
      return Promise.race([
        Promise.all([
          createWebSocketClient(`ws://localhost:${TEST_PORT}`),
          createWebSocketClient(`ws://localhost:${TEST_PORT}`)
        ]),
        timeout
      ]);
    };
    
    const [client1, client2] = await createClients();
    
    try {
      log('Clients connected, setting up message handlers...');
      
      // Helper function to create a message promise for a client
      const createMessagePromise = (client: WebSocketClient & { id?: string }, expectedMessage: string) => {
        return new Promise<void>((resolve, reject) => {
          const clientId = client.id || 'unknown';
          log(`[${clientId}] Setting up handler for message: ${expectedMessage}`);
          
          const cleanup = () => {
            clearTimeout(timeoutId);
            client.onmessage = null;
            client.onerror = null;
          };
          
          const messageHandler = (event: MessageEvent) => {
            try {
              const received = event.data.toString();
              log(`[${clientId}] Received message:`, received);
              
              // Skip ping messages
              if (received.includes('"type":"ping"')) {
                log(`[${clientId}] Received ping, ignoring...`);
                return;
              }
              
              expect(received).toBe(`Echo: ${expectedMessage}`);
              cleanup();
              resolve();
            } catch (err) {
              log(`[${clientId}] Error in message handler:`, err);
              cleanup();
              reject(err);
            }
          };
          
          const errorHandler = (event: Event) => {
            log(`[${clientId}] WebSocket error:`, event);
            cleanup();
            reject(new Error('WebSocket error occurred'));
          };
          
          client.onmessage = messageHandler;
          client.onerror = errorHandler;
          
          // Send message with error handling
          const sendMessage = () => {
            if (client.readyState === WS_OPEN) {
              log(`[${clientId}] Sending message: ${expectedMessage}`);
              client.send(expectedMessage);
            } else {
              log(`[${clientId}] Client not ready, waiting for open event...`);
              const openHandler = () => {
                client.onopen = null;
                log(`[${clientId}] Client now open, sending message...`);
                client.send(expectedMessage);
              };
              client.onopen = openHandler;
            }
          };
          
          // Add a small delay before sending to ensure connection is established
          const sendTimeout = setTimeout(sendMessage, 100);
          
          // Set a timeout for this message
          const timeoutId = setTimeout(() => {
            log(`[${clientId}] Timeout waiting for message`);
            cleanup();
            reject(new Error(`Timeout waiting for message: ${expectedMessage}`));
          }, 5000);
        });
      };
      
      // Create message promises
      const messagePromises = [
        createMessagePromise(client1, testMessage1),
        createMessagePromise(client2, testMessage2)
      ];
      
      log('Waiting for messages to be received...');
      await Promise.all(messagePromises);
      
    } finally {
      log('Cleaning up clients...');
      // Clean up
      if (client1.readyState === WS_OPEN) client1.close();
      if (client2.readyState === WS_OPEN) client2.close();
    }
  }, 15000);
});
