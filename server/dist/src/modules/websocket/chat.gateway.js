"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const jwt_ws_auth_guard_1 = require("../auth/guards/jwt-ws-auth.guard");
const auth_service_1 = require("../auth/auth.service");
const ws_throttler_guard_1 = require("./guards/ws-throttler.guard");
const config_1 = require("@nestjs/config");
const presence_service_1 = require("../presence/presence.service");
const message_queue_1 = require("./message-queue");
let ChatGateway = ChatGateway_1 = class ChatGateway {
    get server() {
        return this.io;
    }
    constructor(authService, configService, presenceService) {
        this.authService = authService;
        this.configService = configService;
        this.presenceService = presenceService;
        this.logger = new common_1.Logger(ChatGateway_1.name);
        this.clientQueues = new Map();
        this.HEARTBEAT_INTERVAL = 30000;
        this.heartbeatIntervals = new Map();
        this.MAX_QUEUE_SIZE = 100;
        this.connectedClients = new Map();
        this.messageQueues = new Map();
        this.rooms = new Map();
        this.rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
            points: 100,
            duration: 60,
        });
        this.logger = new common_1.Logger(ChatGateway_1.name);
        this.logger.log('ChatGateway initialized');
    }
    afterInit(server) {
        this.io = server;
    }
    onModuleInit() {
        this.logger.log('ChatGateway initialized');
    }
    async handleConnection(client) {
        try {
            client.isAlive = true;
            client.lastPing = Date.now();
            const userId = client.handshake?.query?.userId;
            const username = client.handshake?.query?.username || 'anonymous';
            if (!userId) {
                this.logger.warn('Connection rejected: Missing userId');
                client.disconnect(true);
                return;
            }
            const connectedClient = {
                socket: client,
                userId,
                username,
                isAlive: true,
                lastPing: Date.now()
            };
            this.connectedClients.set(client.id, connectedClient);
            this.logger.log(`Client connected: ${client.id} (User: ${username})`);
            const pingInterval = setInterval(() => {
                const clientData = this.connectedClients.get(client.id);
                if (!clientData?.isAlive) {
                    client.disconnect(true);
                    return clearInterval(pingInterval);
                }
                clientData.isAlive = false;
                client.emit('ping');
            }, this.HEARTBEAT_INTERVAL);
            client.once('disconnect', () => {
                clearInterval(pingInterval);
                this.connectedClients.delete(client.id);
            });
            client.on('pong', () => {
                const clientData = this.connectedClients.get(client.id);
                if (clientData) {
                    clientData.isAlive = true;
                    clientData.lastPing = Date.now();
                }
            });
            if (!this.messageQueues.has(client.id)) {
                const messageQueue = new message_queue_1.MessageQueue(client);
                this.messageQueues.set(client.id, messageQueue);
                this.clientQueues.set(client.id, messageQueue);
            }
            this.setupHeartbeat(client);
            this.presenceService.updateUserPresence(userId);
            this.server.emit('userConnected', {
                userId,
                username,
                timestamp: new Date().toISOString(),
            });
            const connectedUsers = Array.from(this.connectedClients.values())
                .filter(c => c.userId)
                .map(({ userId, username }) => ({ userId, username }));
            client.emit('userList', connectedUsers);
            client.on('pong', () => {
                client.isAlive = true;
                client.lastPing = Date.now();
            });
            const presenceUserId = client.handshake.query.userId;
            if (presenceUserId) {
                this.presenceService.updateUserPresence(presenceUserId);
            }
        }
        catch (error) {
            this.logger.error('Error in handleConnection:', error);
            client.disconnect(true);
        }
    }
    async handleDisconnect(client) {
        try {
            const disconnectedClient = this.connectedClients.get(client.id);
            if (!disconnectedClient) {
                this.logger.warn(`No client found for socket ID: ${client.id}`);
                return;
            }
            const { userId, username } = disconnectedClient;
            const logPrefix = `[${client.id}] [User: ${username || 'unknown'}]`;
            this.logger.log(`${logPrefix} Disconnecting...`);
            this.server.emit('userDisconnected', {
                userId,
                username,
                timestamp: new Date().toISOString(),
            });
            this.cleanupClientResources(client.id);
            if (userId) {
                this.presenceService.removeUserPresence(userId);
            }
            this.logger.log(`${logPrefix} Disconnected successfully`);
        }
        catch (error) {
            this.logger.error(`Error in handleDisconnect for client ${client.id}:`, error);
        }
    }
    cleanupClientResources(clientId) {
        this.connectedClients.delete(clientId);
        const queue = this.clientQueues.get(clientId);
        if (queue) {
            queue.stop();
            this.clientQueues.delete(clientId);
        }
        this.clearHeartbeat(clientId);
        this.messageQueues.delete(clientId);
        this.rooms.forEach((sockets, roomId) => {
            if (sockets.has(clientId)) {
                sockets.delete(clientId);
                if (sockets.size === 0) {
                    this.rooms.delete(roomId);
                }
            }
        });
    }
    async onModuleDestroy() {
        this.logger.log('Cleaning up WebSocket resources...');
        this.heartbeatIntervals.forEach((interval, clientId) => {
            clearInterval(interval);
            this.heartbeatIntervals.delete(clientId);
        });
        this.connectedClients.forEach(client => {
            try {
                if (client?.socket) {
                    client.socket.disconnect(true);
                }
            }
            catch (err) {
                this.logger.error(`Error disconnecting client: ${err}`);
            }
        });
        this.connectedClients.clear();
        this.messageQueues.clear();
        this.rooms.clear();
        this.clientQueues.clear();
        this.logger.log('WebSocket resources cleaned up');
    }
    async sendToClient(client, event, data) {
        try {
            const queue = this.clientQueues.get(client.id);
            if (queue) {
                await queue.enqueue(event, data);
            }
            else {
                client.emit(event, data);
            }
        }
        catch (error) {
            this.logger.error(`Error sending to client ${client.id}:`, error);
        }
    }
    async handleAuth(client, data) {
        try {
            const user = await this.authService.verifyToken(data.token);
            if (!user) {
                throw new Error('Invalid token');
            }
            client.user = user;
            if (data.projectId) {
                await client.join(`project:${data.projectId}`);
                client.projectId = data.projectId;
            }
            return { success: true, user: { id: user.id, username: user.username } };
        }
        catch (error) {
            this.logger.error('Authentication error:', error);
            throw new Error('Authentication failed');
        }
    }
    clearHeartbeat(clientId) {
        const interval = this.heartbeatIntervals.get(clientId);
        if (interval) {
            clearInterval(interval);
            this.heartbeatIntervals.delete(clientId);
            this.logger.debug(`Cleared heartbeat for client ${clientId}`);
        }
    }
    setupHeartbeat(client) {
        const clientId = client.id;
        this.clearHeartbeat(clientId);
        const interval = setInterval(() => {
            const clientData = this.connectedClients.get(clientId);
            if (!clientData?.isAlive) {
                this.logger.warn(`Client ${clientId} heartbeat timeout`);
                return client.disconnect(true);
            }
            clientData.isAlive = false;
            client.emit('ping');
        }, this.HEARTBEAT_INTERVAL);
        this.heartbeatIntervals.set(clientId, interval);
        const onPong = () => {
            const clientData = this.connectedClients.get(clientId);
            if (clientData) {
                clientData.isAlive = true;
                clientData.lastPing = Date.now();
            }
        };
        const onDisconnect = () => {
            this.clearHeartbeat(clientId);
            client.off('pong', onPong);
            client.off('disconnect', onDisconnect);
        };
        client.on('pong', onPong);
        client.once('disconnect', onDisconnect);
    }
    async handleRateLimit(client) {
        try {
            await this.rateLimiter.consume(client.id);
            return true;
        }
        catch (error) {
            this.logger.warn(`Rate limit exceeded for client ${client.id}`);
            client.emit('error', { message: 'Rate limit exceeded. Please try again later.' });
            client.disconnect(true);
            return false;
        }
    }
    async broadcastToRoom(roomId, event, data, excludeClientId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            this.logger.warn(`Attempted to broadcast to non-existent room: ${roomId}`);
            return;
        }
        const sockets = Array.from(room)
            .map(socketId => this.connectedClients.get(socketId)?.socket)
            .filter((socket) => !!socket);
        await Promise.all(sockets.map(socket => {
            if (socket.id !== excludeClientId) {
                return this.sendToClient(socket, event, data);
            }
            return Promise.resolve();
        }));
    }
    async handleMessage(client, data) {
        const userId = client.handshake?.query?.userId;
        const username = client.handshake?.query?.username || 'Anonymous';
        const logPrefix = `[${client.id}] [User: ${username}]`;
        if (!userId) {
            this.logger.warn(`${logPrefix} Unauthenticated message attempt`);
            client.emit('error', {
                code: 'UNAUTHENTICATED',
                message: 'Authentication required'
            });
            return;
        }
        if (!data?.content?.trim()) {
            this.logger.warn(`${logPrefix} Empty message content`);
            client.emit('error', {
                code: 'INVALID_INPUT',
                message: 'Message content cannot be empty'
            });
            return;
        }
        try {
            const canProceed = await this.handleRateLimit(client);
            if (!canProceed) {
                this.logger.warn(`${logPrefix} Rate limit exceeded`);
                return;
            }
            const timestamp = new Date().toISOString();
            const message = {
                id: (0, uuid_1.v4)(),
                content: data.content.trim(),
                userId,
                username,
                timestamp,
                roomId: data.roomId
            };
            this.logger.log(`${logPrefix} Sending message to ${data.roomId ? `room ${data.roomId}` : 'all clients'}`);
            if (data.roomId) {
                await this.broadcastToRoom(data.roomId, 'message', message, client.id);
            }
            else {
                this.server.emit('message', message);
            }
            client.emit('messageAck', { id: message.id, timestamp });
        }
        catch (error) {
            const errorId = (0, uuid_1.v4)();
            this.logger.error(`${logPrefix} Error handling message (${errorId}):`, error);
            client.emit('error', {
                id: errorId,
                code: 'MESSAGE_DELIVERY_FAILED',
                message: 'Failed to send message',
                timestamp: new Date().toISOString()
            });
        }
    }
    getUserClients(userId) {
        const clients = [];
        if (this.server?.sockets?.sockets) {
            this.server.sockets.sockets.forEach((socket) => {
                const socketUserId = socket.handshake.query.userId || '';
                if (socketUserId === userId) {
                    clients.push(socket);
                }
            });
        }
        return clients;
    }
    async broadcastToProject(projectId, message) {
        const clients = this.getUserClients(projectId);
        await Promise.all(clients.map(client => {
            try {
                return new Promise((resolve) => {
                    client.emit('broadcast', message, () => resolve());
                }).catch((err) => {
                    this.logger.error(`Broadcast failed: ${err.message}`);
                });
            }
            catch (err) {
                this.logger.error('Error in broadcastToProject:', err);
                return Promise.resolve();
            }
        }));
    }
    findRecipientQueue(userId) {
        for (const [clientId, queue] of this.clientQueues.entries()) {
            const client = this.connectedClients.get(clientId);
            if (client?.userId === userId) {
                return queue;
            }
        }
        return undefined;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "io", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('authenticate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAuth", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        namespace: 'chat',
        pingInterval: 30000,
        pingTimeout: 10000,
    }),
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard, ws_throttler_guard_1.WsThrottlerGuard),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService,
        presence_service_1.PresenceService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map