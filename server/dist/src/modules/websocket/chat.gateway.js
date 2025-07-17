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
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_ws_auth_guard_1 = require("../auth/guards/jwt-ws-auth.guard");
const auth_service_1 = require("../auth/auth.service");
const ws_throttler_guard_1 = require("./guards/ws-throttler.guard");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
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
        this.rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
            points: 100,
            duration: 1,
        });
    }
    onModuleInit() {
        this.logger.log('ChatGateway initialized');
    }
    async handleConnection(client) {
        try {
            const messageQueue = new message_queue_1.MessageQueue(client);
            this.clientQueues.set(client.id, messageQueue);
            client.isAlive = true;
            client.on('pong', () => {
                client.isAlive = true;
                client.lastPing = Date.now();
            });
            this.presenceService.updateUserPresence(client.userId);
            this.logger.log(`Client connected: ${client.id} (User: ${client.userId})`);
        }
        catch (error) {
            this.logger.error('Error in handleConnection:', error);
            if (client.connected) {
                client.disconnect(true);
            }
        }
    }
    async handleDisconnect(client) {
        try {
            const queue = this.clientQueues.get(client.id);
            if (queue) {
                queue.stop();
                this.clientQueues.delete(client.id);
            }
            this.cleanupHeartbeat(client.id);
            this.presenceService.removeUserPresence(client.userId);
            this.logger.log(`Client disconnected: ${client.id} (User: ${client.userId})`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : '';
            this.logger.error(`Disconnection error: ${errorMessage}`, errorStack);
        }
    }
    async handleAuth(client, data) {
        try {
            const payload = await this.authService.verifyToken(data.token);
            if (!payload) {
                throw new Error('Invalid token');
            }
            client.userId = payload.sub;
            client.projectId = data.projectId;
            client.emit('auth_success', {
                type: 'auth_success',
                userId: client.userId,
                projectId: client.projectId,
            });
            this.logger.log(`Client authenticated: ${client.id} (User: ${client.userId})`);
        }
        catch (error) {
            this.logger.error(`Auth error: ${error.message}`);
            client.disconnect();
        }
    }
    async handleMessage(client, data) {
        if (!data || !data.to || !data.content) {
            throw new Error('Invalid message format');
        }
        try {
            await this.rateLimiter.consume(client.id);
            const timestamp = new Date().toISOString();
            const message = {
                from: client.userId,
                to: data.to,
                content: data.content,
                timestamp,
                ...(data.metadata || {})
            };
            if (data.to.startsWith('room:')) {
                this.server.to(data.to).emit('message', message);
            }
            else {
                const recipientQueue = this.findRecipientQueue(data.to);
                if (recipientQueue) {
                    recipientQueue.enqueue('message', message);
                }
                else {
                    this.logger.warn(`Recipient ${data.to} not found`);
                    this.emitToClient(client.id, 'error', {
                        code: 'RECIPIENT_OFFLINE',
                        message: 'The recipient is not connected',
                        recipientId: data.to,
                        timestamp
                    });
                }
            }
            return message;
        }
        catch (error) {
            this.logger.error('Error handling message:', error);
            throw error;
        }
    }
    async handleTyping(client, data) {
        try {
            await this.rateLimiter.consume(client.id);
            this.server.emit('userTyping', {
                userId: client.userId,
                isTyping: data.isTyping
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : '';
            this.logger.error(`Typing error: ${errorMessage}`, errorStack);
        }
    }
    emitToClient(clientId, event, data) {
        const client = this.server.sockets.sockets.get(clientId);
        if (client) {
            client.emit(event, data);
        }
    }
    getUserClients(userId) {
        const clients = [];
        this.server.sockets.sockets.forEach((socket) => {
            const wsClient = socket;
            if (wsClient.userId === userId) {
                clients.push(wsClient);
            }
        });
        return clients;
    }
    async broadcastToProject(projectId, message) {
        const clients = this.getUserClients(projectId);
        await Promise.all(clients.map(client => {
            if (client.connected) {
                return new Promise((resolve) => {
                    client.emit('broadcast', message, () => {
                        resolve();
                    });
                }).catch(err => {
                    this.logger.error(`Broadcast failed to ${client.id}: ${err.message}`);
                });
            }
            return Promise.resolve();
        }));
    }
    cleanupHeartbeat(clientId) {
        const interval = this.heartbeatIntervals.get(clientId);
        if (interval) {
            clearInterval(interval);
            this.heartbeatIntervals.delete(clientId);
        }
    }
    findRecipientQueue(userId) {
        for (const [clientId, queue] of this.clientQueues.entries()) {
            const client = this.server.sockets.sockets.get(clientId);
            if (client?.userId === userId) {
                return queue;
            }
        }
        return undefined;
    }
    onModuleDestroy() {
        this.heartbeatIntervals.forEach((interval) => {
            clearInterval(interval);
        });
        this.heartbeatIntervals.clear();
        this.clientQueues.forEach((queue) => {
            queue.stop();
        });
        this.clientQueues.clear();
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
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
exports.ChatGateway = ChatGateway = ChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://your-production-domain.com']
                : ['http://localhost:3000', 'http://localhost:3001'],
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