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
var RtcGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtcGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_ws_auth_guard_1 = require("../auth/guards/jwt-ws-auth.guard");
let RtcGateway = RtcGateway_1 = class RtcGateway {
    constructor() {
        this.logger = new common_1.Logger(RtcGateway_1.name);
        this.userSockets = new Map();
        this.socketToUser = new Map();
    }
    registerWsServer(server) {
        this.server = server;
    }
    async handleConnection(client) {
        if (!this.server) {
            this.logger.error('WebSocket server not initialized');
            client.disconnect();
            return;
        }
        const userId = client.user?.sub;
        if (!userId) {
            client.disconnect();
            return;
        }
        try {
            await client.join(userId);
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            const userSockets = this.userSockets.get(userId);
            if (userSockets) {
                userSockets.add(client.id);
                this.socketToUser.set(client.id, userId);
                client.emit('connection-success', { userId });
            }
            else {
                this.logger.warn(`Failed to find user sockets for user ${userId}`);
            }
            this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
            this.logger.debug(`Total users: ${this.userSockets.size}, Total connections: ${this.socketToUser.size}`);
        }
        catch (error) {
            this.logger.error(`Error during connection handling: ${error.message}`, error.stack);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = this.socketToUser.get(client.id);
        if (!userId)
            return;
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
            userSockets.delete(client.id);
            if (userSockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
        this.socketToUser.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }
    emitToUser(userId, event, payload) {
        if (!this.server || !this.server.sockets || !this.server.sockets.sockets) {
            this.logger.warn('WebSocket server not properly initialized');
            return false;
        }
        const userSockets = this.userSockets.get(userId);
        if (!userSockets) {
            this.logger.warn(`Attempted to emit to user ${userId} but no sockets found`);
            return false;
        }
        let emitted = false;
        try {
            for (const socketId of userSockets) {
                const socket = this.server.sockets.sockets.get(socketId);
                if (socket) {
                    socket.emit(event, payload);
                    emitted = true;
                }
            }
            if (!emitted) {
                this.logger.warn(`Failed to emit to any socket for user ${userId}`);
            }
        }
        catch (error) {
            this.logger.error(`Error emitting to user ${userId}: ${error.message}`, error.stack);
            return false;
        }
        return emitted;
    }
};
exports.RtcGateway = RtcGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RtcGateway.prototype, "server", void 0);
exports.RtcGateway = RtcGateway = RtcGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'rtc',
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://your-production-domain.com']
                : ['http://localhost:3000'],
            credentials: true,
        },
    }),
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard)
], RtcGateway);
//# sourceMappingURL=rtc.gateway.js.map