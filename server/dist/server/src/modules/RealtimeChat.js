"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeChat = void 0;
const ws_1 = require("ws");
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
class RealtimeChat {
    constructor(server, jwtSecret) {
        this.jwtSecret = jwtSecret;
        this.clients = new Map();
        this.rooms = new Map();
        this.HEARTBEAT_INTERVAL = 15000;
        this.wss = new ws_1.WebSocketServer({ noServer: true });
        this.setupWebSocketHandlers();
        this.setupUpgradeHandler(server);
        this.setupHeartbeat();
    }
    setupWebSocketHandlers() {
        this.wss.on('connection', (ws, clientId, user) => {
            console.log(`Client connected: ${clientId} (${user.displayName})`);
            const client = {
                ws,
                userId: user.id,
                rooms: new Set(),
                lastHeartbeat: Date.now()
            };
            this.clients.set(clientId, client);
            this.broadcastPresence(user.id, 'online');
            ws.on('message', (data) => this.handleMessage(clientId, data));
            ws.on('close', () => this.handleDisconnect(clientId, user.id));
            ws.on('pong', () => {
                const client = this.clients.get(clientId);
                if (client)
                    client.lastHeartbeat = Date.now();
            });
            this.sendToClient(clientId, {
                roomId: 'system',
                userId: 'system',
                ts: Date.now(),
                type: 'system',
                payload: { message: 'Connected to chat server' }
            });
        });
    }
    setupUpgradeHandler(server) {
        server.on('upgrade', (request, socket, head) => {
            const token = request.url?.split('token=')[1];
            if (!token) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }
            try {
                const decoded = (0, jsonwebtoken_1.verify)(token, this.jwtSecret);
                const clientId = (0, uuid_1.v4)();
                this.wss.handleUpgrade(request, socket, head, (ws) => {
                    this.wss.emit('connection', ws, clientId, {
                        id: decoded.userId,
                        displayName: decoded.displayName || decoded.email
                    });
                });
            }
            catch (error) {
                console.error('WebSocket auth failed:', error);
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
            }
        });
    }
    setupHeartbeat() {
        setInterval(() => {
            const now = Date.now();
            this.clients.forEach((client, clientId) => {
                if (now - client.lastHeartbeat > this.HEARTBEAT_INTERVAL * 2) {
                    console.log(`Client ${clientId} timed out`);
                    client.ws.terminate();
                    this.clients.delete(clientId);
                    this.broadcastPresence(client.userId, 'offline');
                }
                else {
                    client.ws.ping();
                }
            });
        }, this.HEARTBEAT_INTERVAL);
    }
    handleMessage(clientId, data) {
        try {
            const message = JSON.parse(data);
            const client = this.clients.get(clientId);
            if (!client)
                return;
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
                    if (message.payload.action === 'join') {
                        this.joinRoom(clientId, message.roomId);
                    }
                    else if (message.payload.action === 'leave') {
                        this.leaveRoom(clientId, message.roomId);
                    }
                    break;
            }
        }
        catch (error) {
            console.error('Error handling message:', error);
        }
    }
    handleChatMessage(sender, message) {
        if (!message.roomId)
            return;
        const roomClients = this.rooms.get(message.roomId);
        if (!roomClients)
            return;
        const fullMessage = {
            ...message,
            ts: Date.now(),
        };
        roomClients.forEach(clientId => {
            if (clientId !== sender.userId) {
                this.sendToClient(clientId, fullMessage);
            }
        });
    }
    broadcastPresence(userId, status) {
        const presenceMessage = {
            roomId: 'presence',
            userId,
            ts: Date.now(),
            type: 'presence',
            payload: { userId, status, timestamp: Date.now() }
        };
        this.broadcastToAll(presenceMessage);
    }
    broadcastInventoryUpdate(sender, message) {
        if (!sender.rooms.has(message.roomId)) {
            console.warn(`User ${sender.userId} attempted to update inventory for unauthorized room ${message.roomId}`);
            return;
        }
        const inventoryMessage = {
            ...message,
            ts: Date.now(),
            type: 'inventory'
        };
        this.broadcastToRoom(message.roomId, inventoryMessage, sender.userId);
    }
    joinRoom(clientId, roomId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId)?.add(clientId);
        client.rooms.add(roomId);
        console.log(`Client ${clientId} joined room ${roomId}`);
    }
    leaveRoom(clientId, roomId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        this.rooms.get(roomId)?.delete(clientId);
        client.rooms.delete(roomId);
        console.log(`Client ${clientId} left room ${roomId}`);
    }
    sendToClient(clientId, message) {
        const client = this.clients.get(clientId);
        if (client?.ws.readyState === ws_1.WebSocket.OPEN) {
            client.ws.send(JSON.stringify(message));
        }
    }
    broadcastToRoom(roomId, message, excludeClientId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.forEach(clientId => {
            if (clientId !== excludeClientId) {
                this.sendToClient(clientId, message);
            }
        });
    }
    broadcastToAll(message) {
        this.clients.forEach((_, clientId) => {
            this.sendToClient(clientId, message);
        });
    }
    handleDisconnect(clientId, userId) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        client.rooms.forEach(roomId => {
            this.rooms.get(roomId)?.delete(clientId);
        });
        this.clients.delete(clientId);
        this.broadcastPresence(userId, 'offline');
        console.log(`Client disconnected: ${clientId}`);
    }
    getClientCount() {
        return this.clients.size;
    }
    getRoomCount() {
        return this.rooms.size;
    }
}
exports.RealtimeChat = RealtimeChat;
//# sourceMappingURL=RealtimeChat.js.map