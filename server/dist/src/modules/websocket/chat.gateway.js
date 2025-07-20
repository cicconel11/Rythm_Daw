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
    onModuleInit() {
        this.logger.log('ChatGateway initialized');
    }
    async handleConnection(client) {
        try {
            client.isAlive = true;
            client.lastPing = Date.now();
            const userId = client.handshake.query.userId;
            const username = client.handshake.query.username;
            if (!userId) {
                this.logger.warn(`Connection rejected: Missing userId`);
                client.disconnect(true);
                return;
            }
            this.connectedClients.set(client.id, {
                socket: client,
                userId,
                username: username || 'anonymous',
                isAlive: true,
                lastPing: Date.now()
            });
            this.logger.log(`Client connected: ${client.id} (User: ${username || 'anonymous'})`);
            const pingInterval = setInterval(() => {
                const clientData = this.connectedClients.get(client.id);
                if (!clientData?.isAlive) {
                    client.disconnect(true);
                    return clearInterval(pingInterval);
                }
                clientData.isAlive = false;
                client.emit('ping');
            }, 30000);
            client.once('disconnect', () => clearInterval(pingInterval));
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
            }
            this.setupHeartbeat(client);
            this.presenceService.updateUserPresence(userId);
            if (this.server) {
                this.server.emit('userConnected', {
                    userId,
                    username: username || 'anonymous',
                    timestamp: new Date().toISOString(),
                });
            }
            const connectedUsers = Array.from(this.connectedClients.values())
                .filter(c => c.userId)
                .map(({ userId, username }) => ({ userId, username }));
            client.emit('userList', connectedUsers);
            const messageQueue = new message_queue_1.MessageQueue(client);
            this.clientQueues.set(client.id, messageQueue);
            client.isAlive = true;
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
            if (disconnectedClient) {
                const { userId, username } = disconnectedClient;
                this.server.emit('userDisconnected', {
                    userId,
                    username,
                    timestamp: new Date().toISOString(),
                });
                this.connectedClients.delete(client.id);
                this.logger.log(`Client disconnected: ${client.id} (User: ${username || 'anonymous'})`);
                const queue = this.clientQueues.get(client.id);
                if (queue) {
                    queue.stop();
                    this.clientQueues.delete(client.id);
                }
                this.clearHeartbeat(client.id);
                if (userId) {
                    this.presenceService.removeUserPresence(userId);
                }
            }
        }
        catch (error) {
            this.logger.error('Error in handleDisconnect:', error);
        }
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
    async handleMessage(client, data) {
        const userId = client.handshake.query.userId;
        const username = client.handshake.query.username || 'Anonymous';
        if (!userId) {
            client.emit('error', { message: 'Not authenticated' });
            return;
        }
        try {
            const canProceed = await this.handleRateLimit(client);
            if (!canProceed)
                return;
            const timestamp = new Date().toISOString();
            const message = {
                id: (0, uuid_1.v4)(),
                content: data.content,
                userId,
                username,
                timestamp,
            };
            if (data.roomId) {
                await this.broadcastToRoom(data.roomId, 'message', message, client.id);
            }
            else {
                if (this.server) {
                    this.server.emit('message', message);
                }
            }
            client.emit('messageAck', { id: message.id, timestamp });
        }
        catch (error) {
            this.logger.error('Error handling message:', error);
            client.emit('error', { message: 'Failed to send message' });
        }
    }
    broadcastToRoom(roomId, event, data, excludeSocketId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        for (const socketId of room) {
            if (socketId === excludeSocketId)
                continue;
            const client = this.connectedClients.get(socketId);
            if (client) {
                client.socket.emit(event, data);
            }
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
], ChatGateway.prototype, "server", void 0);
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