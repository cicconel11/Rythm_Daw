import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

type User = {
  id: string;
  displayName: string;
};

type Message = {
  roomId: string;
  userId: string;
  ts: number;
  type: 'chat' | 'presence' | 'inventory' | 'system';
  payload: any;
};

type Client = {
  ws: WebSocket;
  userId: string;
  rooms: Set<string>;
  lastHeartbeat: number;
};

export class RealtimeChat {
  private wss: WebSocketServer;
  private clients: Map<string, Client> = new Map();
  private rooms: Map<string, Set<string>> = new Map(); // roomId -> Set of clientIds
  private readonly HEARTBEAT_INTERVAL = 15000; // 15 seconds

  constructor(server: Server, private jwtSecret: string) {
    this.wss = new WebSocketServer({ noServer: true });
    this.setupWebSocketHandlers();
    this.setupUpgradeHandler(server);
    this.setupHeartbeat();
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws: WebSocket, clientId: string, user: User) => {
      console.log(`Client connected: ${clientId} (${user.displayName})`);
      
      const client: Client = {
        ws,
        userId: user.id,
        rooms: new Set(),
        lastHeartbeat: Date.now()
      };

      this.clients.set(clientId, client);
      this.broadcastPresence(user.id, 'online');

      ws.on('message', (data: string) => this.handleMessage(clientId, data));
      ws.on('close', () => this.handleDisconnect(clientId, user.id));
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) client.lastHeartbeat = Date.now();
      });

      // Send welcome message
      this.sendToClient(clientId, {
        roomId: 'system',
        userId: 'system',
        ts: Date.now(),
        type: 'system',
        payload: { message: 'Connected to chat server' }
      });
    });
  }

  private setupUpgradeHandler(server: Server) {
    server.on('upgrade', (request, socket, head) => {
      const token = request.url?.split('token=')[1];
      
      if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      try {
        const decoded = verify(token, this.jwtSecret) as { userId: string; email: string; displayName: string };
        const clientId = uuidv4();
        
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit('connection', ws, clientId, {
            id: decoded.userId,
            displayName: decoded.displayName || decoded.email
          });
        });
      } catch (error) {
        console.error('WebSocket auth failed:', error);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
      }
    });
  }

  private setupHeartbeat() {
    setInterval(() => {
      const now = Date.now();
      this.clients.forEach((client, clientId) => {
        if (now - client.lastHeartbeat > this.HEARTBEAT_INTERVAL * 2) {
          console.log(`Client ${clientId} timed out`);
          client.ws.terminate();
          this.clients.delete(clientId);
          this.broadcastPresence(client.userId, 'offline');
        } else {
          client.ws.ping();
        }
      });
    }, this.HEARTBEAT_INTERVAL);
  }

  private handleMessage(clientId: string, data: string) {
    try {
      const message = JSON.parse(data) as Message;
      const client = this.clients.get(clientId);
      
      if (!client) return;

      switch (message.type) {
        case 'chat':
          this.handleChatMessage(client, message);
          break;
        case 'presence':
          this.broadcastPresence(client.userId, message.payload.status);
          break;
        case 'inventory':
          this.broadcastInventoryUpdate(client, message);
          break;
        case 'system':
          // Handle system messages (e.g., room join/leave)
          if (message.payload.action === 'join') {
            this.joinRoom(clientId, message.roomId);
          } else if (message.payload.action === 'leave') {
            this.leaveRoom(clientId, message.roomId);
          }
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private handleChatMessage(sender: Client, message: Message) {
    if (!message.roomId) return;
    
    const roomClients = this.rooms.get(message.roomId);
    if (!roomClients) return;

    const fullMessage: Message = {
      ...message,
      ts: Date.now(),
    };

    // Broadcast to all clients in the room except sender
    roomClients.forEach(clientId => {
      if (clientId !== sender.userId) {
        this.sendToClient(clientId, fullMessage);
      }
    });
  }

  private broadcastPresence(userId: string, status: 'online' | 'offline' | 'away') {
    const presenceMessage: Message = {
      roomId: 'presence',
      userId,
      ts: Date.now(),
      type: 'presence',
      payload: { userId, status, timestamp: Date.now() }
    };

    // Broadcast to all clients
    this.broadcastToAll(presenceMessage);
  }

  private broadcastInventoryUpdate(sender: Client, message: Message) {
    // Verify the user has access to the room they're trying to update
    if (!sender.rooms.has(message.roomId)) {
      console.warn(`User ${sender.userId} attempted to update inventory for unauthorized room ${message.roomId}`);
      return;
    }

    const inventoryMessage: Message = {
      ...message,
      ts: Date.now(),
      type: 'inventory'
    };

    // Broadcast to all clients in the room except sender
    this.broadcastToRoom(message.roomId, inventoryMessage, sender.userId);
  }

  private joinRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId)?.add(clientId);
    client.rooms.add(roomId);

    console.log(`Client ${clientId} joined room ${roomId}`);
  }

  private leaveRoom(clientId: string, roomId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    this.rooms.get(roomId)?.delete(clientId);
    client.rooms.delete(roomId);

    console.log(`Client ${clientId} left room ${roomId}`);
  }

  private sendToClient(clientId: string, message: Message) {
    const client = this.clients.get(clientId);
    if (client?.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private broadcastToRoom(roomId: string, message: Message, excludeClientId?: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.forEach(clientId => {
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, message);
      }
    });
  }

  private broadcastToAll(message: Message) {
    this.clients.forEach((_, clientId) => {
      this.sendToClient(clientId, message);
    });
  }

  private handleDisconnect(clientId: string, userId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Leave all rooms
    client.rooms.forEach(roomId => {
      this.rooms.get(roomId)?.delete(clientId);
    });

    this.clients.delete(clientId);
    this.broadcastPresence(userId, 'offline');
    console.log(`Client disconnected: ${clientId}`);
  }

  // Public API
  public getClientCount(): number {
    return this.clients.size;
  }

  public getRoomCount(): number {
    return this.rooms.size;
  }
}
