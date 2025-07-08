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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const common_1 = require("@nestjs/common");
const jwt_ws_auth_guard_1 = require("../auth/guards/jwt-ws-auth.guard");
const auth_service_1 = require("../auth/auth.service");
const ws_throttler_guard_1 = require("./guards/ws-throttler.guard");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const config_1 = require("@nestjs/config");
let ChatGateway = class ChatGateway {
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
        this.logger = new common_1.Logger('ChatGateway');
        this.clients = new Map();
        this.rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
            points: 100,
            duration: 1,
        });
        this.MAX_QUEUE_SIZE = 100;
        this.HEARTBEAT_INTERVAL = 30000;
        this.heartbeatInterval = setInterval(() => this.checkHeartbeat(), this.HEARTBEAT_INTERVAL);
    }
    cleanup() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.clients.forEach(client => {
            if (client.readyState === ws_1.WebSocket.OPEN) {
                client.terminate();
            }
        });
        this.clients.clear();
    }
    async handleConnection(client) {
        try {
            client.id = Math.random().toString(36).substring(2, 15);
            client.isAlive = true;
            client.on('pong', () => {
                client.isAlive = true;
            });
            client.sendMessage = async (data) => {
                return new Promise((resolve, reject) => {
                    if (client.readyState !== ws_1.WebSocket.OPEN) {
                        return reject(new Error('WebSocket not open'));
                    }
                    if (client.bufferedAmount > this.MAX_QUEUE_SIZE * 1024) {
                        client.pause();
                        client.once('drain', () => {
                            client.resume();
                            client.send(JSON.stringify(data), (err) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve();
                            });
                        });
                    }
                    else {
                        client.send(JSON.stringify(data), (err) => {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    }
                });
            };
            this.clients.set(client, client);
            this.logger.log(`Client connected: ${client.id}`);
        }
        catch (error) {
            this.logger.error(`Connection error: ${error.message}`, error.stack);
            client.terminate();
        }
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.clients.delete(client);
    }
    async handleAuth(client, data) {
        try {
            const payload = await this.authService.verifyToken(data.token);
            if (!payload) {
                throw new Error('Invalid token');
            }
            client.userId = payload.sub;
            client.projectId = data.projectId;
            await client.sendMessage({
                type: 'auth_success',
                userId: client.userId,
                projectId: client.projectId,
            });
            this.logger.log(`Client authenticated: ${client.id} (User: ${client.userId})`);
        }
        catch (error) {
            this.logger.error(`Auth error: ${error.message}`);
            client.terminate();
        }
    }
    async handleMessage(client, data) {
        try {
            if (!client.userId || !client.projectId) {
                throw new Error('Not authenticated');
            }
            try {
                await this.rateLimiter.consume(`ws:${client.userId}`);
            }
            catch (rateLimitError) {
                this.logger.warn(`Rate limit exceeded for user ${client.userId}`);
                await client.sendMessage({
                    type: 'error',
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many messages. Please slow down.',
                });
                return;
            }
            const broadcastPromises = Array.from(this.clients.values())
                .filter(c => c.projectId === client.projectId && c.id !== client.id)
                .map(recipient => recipient.sendMessage({
                type: 'message',
                from: client.userId,
                projectId: client.projectId,
                data,
                timestamp: new Date().toISOString(),
            }).catch(err => {
                this.logger.error(`Failed to send message to ${recipient.id}: ${err.message}`);
                if (err.message.includes('not open')) {
                    this.clients.delete(recipient);
                }
            }));
            await Promise.all(broadcastPromises);
        }
        catch (error) {
            this.logger.error(`Message handling error: ${error.message}`, error.stack);
            await client.sendMessage({
                type: 'error',
                code: 'MESSAGE_ERROR',
                message: error.message,
            });
        }
    }
    checkHeartbeat() {
        this.clients.forEach((_, wsClient) => {
            const client = wsClient;
            if (!client.isAlive) {
                this.logger.log(`Terminating unresponsive client: ${client.id}`);
                return client.terminate();
            }
            client.isAlive = false;
            client.ping(() => { });
        });
    }
    async broadcastToProject(projectId, message) {
        const clients = Array.from(this.clients.values())
            .filter(client => client.projectId === projectId && client.readyState === ws_1.WebSocket.OPEN);
        await Promise.all(clients.map(client => client.sendMessage(message).catch(err => {
            this.logger.error(`Broadcast failed to ${client.id}: ${err.message}`);
        })));
    }
    onModuleDestroy() {
        clearInterval(this.heartbeatInterval);
        this.clients.forEach((_, wsClient) => wsClient.terminate());
        this.clients.clear();
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _a : Object)
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
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        path: '/ws/chat',
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://rhythm.app', 'https://www.rhythm.app']
                : '*',
        },
    }),
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard, ws_throttler_guard_1.WsThrottlerGuard),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map