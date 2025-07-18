const WebSocket = require('ws');
const http = require('http');

// Enable debug logging
process.env.DEBUG = '*';
const debug = require('debug')('websocket-test');

console.log('=== Starting WebSocket Test ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform, process.arch);
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');

// Create HTTP server
console.log('\n=== Creating HTTP server ===');
const server = http.createServer((req, res) => {
  debug('HTTP request:', req.method, req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running\n');
});

// Add error handling
server.on('error', (error) => {
  console.error('HTTP server error:', error);
  process.exit(1);
});

console.log('Creating WebSocket server...');
const wss = new WebSocket.Server({ 
  server,
  clientTracking: true,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    concurrencyLimit: 10,
    threshold: 1024
  }
});

// Track connections
let connectionCount = 0;

// WebSocket server event handlers
wss.on('connection', (ws, req) => {
  const clientId = ++connectionCount;
  const clientIp = req.socket.remoteAddress;
  
  console.log(`\n[Server] New connection #${clientId} from ${clientIp}`);
  console.log(`[Server] Total connections: ${wss.clients.size}`);
  
  // Connection opened
  ws.isAlive = true;
  
  // Message handler
  ws.on('message', (message) => {
    const messageStr = message.toString();
    console.log(`[Server][Client #${clientId}] Received: ${messageStr}`);
    
    // Echo the message back
    const response = `Echo #${Date.now()}: ${messageStr}`;
    console.log(`[Server][Client #${clientId}] Sending: ${response}`);
    ws.send(response);
  });
  
  // Error handler
  ws.on('error', (error) => {
    console.error(`[Server][Client #${clientId}] Error:`, error);
  });
  
  // Close handler
  ws.on('close', (code, reason) => {
    console.log(`[Server][Client #${clientId}] Disconnected. Code: ${code}, Reason: ${reason || 'None'}`);
    console.log(`[Server] Remaining connections: ${wss.clients.size}`);
  });
  
  // Ping-pong for connection health
  ws.on('pong', () => {
    ws.isAlive = true;
  });
  
  // Send welcome message
  const welcomeMsg = `Welcome client #${clientId}! Server time: ${new Date().toISOString()}`;
  console.log(`[Server][Client #${clientId}] Sending welcome: ${welcomeMsg}`);
  ws.send(welcomeMsg);
});

// Ping all clients periodically to check connection health
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log('[Server] Terminating dead connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping(null, false, (err) => {
      if (err) console.error('Ping error:', err);
    });
  });
}, 30000);

// Clean up on server close
wss.on('close', () => {
  clearInterval(interval);
  console.log('WebSocket server closed');
});

// Start server
const PORT = process.env.PORT || 3000;
console.log(`\n=== Starting WebSocket server on port ${PORT} ===`);
server.listen(PORT, '0.0.0.0', () => {
  const { address, port } = server.address();
  console.log(`[Server] WebSocket server running on ws://${address}:${port}`);
  console.log('[Server] Press Ctrl+C to stop the server');
  
  // Run client test
  setTimeout(() => {
    console.log('\n=== Starting WebSocket client test ===');
    runClientTest(port);
  }, 1000);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  
  // Close all client connections
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log(`Closing client connection`);
      client.close(1000, 'Server shutting down');
    }
  });
  
  // Close the server
  wss.close(() => {
    server.close(() => {
      console.log('Server shutdown complete');
      process.exit(0);
    });
  });
});

// Client test
function runClientTest(serverPort) {
  const wsUrl = `ws://localhost:${serverPort}`;
  console.log(`[Client] Connecting to ${wsUrl}...`);
  
  const ws = new WebSocket(wsUrl, {
    perMessageDeflate: false,
    handshakeTimeout: 10000,
    maxPayload: 100 * 1024 * 1024, // 100MB
    headers: {
      'User-Agent': 'WebSocketTestClient/1.0',
      'X-Test-Id': 'test-' + Date.now()
    }
  });
  
  // Connection opened
  ws.on('open', () => {
    console.log('[Client] ✅ Connected to server');
    console.log(`[Client] Protocol version: ${ws.protocol}`);
    
    // Send test messages
    const messages = [
      'Hello from client!',
      'This is a test message',
      'WebSocket connection is working',
      'Goodbye!'
    ];
    
    let messageCount = 0;
    
    const sendNextMessage = () => {
      if (messageCount < messages.length) {
        const msg = messages[messageCount++];
        console.log(`[Client] Sending: ${msg}`);
        ws.send(msg);
        
        // Schedule next message
        if (messageCount < messages.length) {
          setTimeout(sendNextMessage, 1000);
        } else {
          console.log('[Client] All messages sent');
        }
      }
    };
    
    // Start sending messages
    sendNextMessage();
  });
  
  // Message handler
  ws.on('message', (data) => {
    console.log(`[Client] Received: ${data.toString().substring(0, 100)}`);
    
    // If we've received all expected responses, close the connection
    if (data.toString().includes('Goodbye!')) {
      console.log('[Client] Received goodbye message, closing connection');
      ws.close(1000, 'Test completed successfully');
    }
  });
  
  // Error handler
  ws.on('error', (error) => {
    console.error('[Client] WebSocket error:', error);
    process.exit(1);
  });
  
  // Close handler
  ws.on('close', (code, reason) => {
    console.log(`[Client] Connection closed. Code: ${code}, Reason: ${reason || 'None'}`);
    
    if (code === 1000) {
      console.log('[Client] ✅ Test completed successfully');
      process.exit(0);
    } else {
      console.error(`[Client] ❌ Test failed with code ${code}`);
      process.exit(1);
    }
  });
  
  // Set timeout for the entire test
  setTimeout(() => {
    console.error('[Client] ❌ Test timeout (30 seconds)');
    ws.terminate();
    process.exit(1);
  }, 30000);
}
