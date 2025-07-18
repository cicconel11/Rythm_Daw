const http = require('http');
const WebSocket = require('ws');

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  // Send a welcome message
  ws.send('Welcome to the WebSocket server!');
  
  // Handle messages from client
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    
    // Echo the message back
    ws.send(`Echo: ${message}`);
  });
  
  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('WebSocket endpoint: ws://localhost:' + PORT);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  
  // Close all WebSocket connections
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1001, 'Server shutting down');
    }
  });
  
  // Close the server
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});
