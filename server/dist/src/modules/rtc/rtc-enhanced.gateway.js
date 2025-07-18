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
var RtcEnhancedGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtcEnhancedGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_ws_auth_guard_1 = require("../../auth/guards/jwt-ws-auth.guard");
const ws_exception_filter_1 = require("../../common/filters/ws-exception.filter");
const ws_throttler_guard_1 = require("../../common/guards/ws-throttler.guard");
const websocket_types_1 = require("./types/websocket.types");
let RtcEnhancedGateway = RtcEnhancedGateway_1 = class RtcEnhancedGateway {
    constructor() {
        this.logger = new common_1.Logger(RtcEnhancedGateway_1.name);
        this.activeUsers = new Map();
        this.userSockets = new Map();
        this.roomUsers = new Map();
    }
    onModuleInit() {
        this.logger.log('RTC Enhanced WebSocket Gateway initialized');
    }
    async handleConnection(client) {
        try {
            const user = client.handshake?.user;
            if (!user?.userId) {
                this.logger.warn('Connection attempt without valid user');
                client.disconnect(true);
                return;
            }
            this.activeUsers.set(user.userId, user);
            this.userSockets.set(client.id, user.userId);
            this.logger.log(`Client connected: ${client.id} (User: ${user.userId})`);
            client.emit(websocket_types_1.ServerEvents.CONNECT, {
                message: 'Connected to RTC server',
                userId: user.userId,
                timestamp: new Date().toISOString(),
            });
            client.broadcast.emit(websocket_types_1.ServerEvents.USER_JOINED, {
                userId: user.userId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.error('Connection error:', error);
            client.emit(websocket_types_1.ServerEvents.ERROR, {
                status: 'error',
                message: 'Connection error',
                error: error.message,
            });
            client.disconnect(true);
        }
    }
    async handleDisconnect(client) {
        const userId = this.userSockets.get(client.id);
        if (userId) {
            this.activeUsers.delete(userId);
            this.userSockets.delete(client.id);
            this.roomUsers.forEach((users, roomId) => {
                if (users.has(userId)) {
                    users.delete(userId);
                    client.to(roomId).emit(websocket_types_1.ServerEvents.USER_LEFT, {
                        userId,
                        roomId,
                        timestamp: new Date().toISOString(),
                    });
                }
            });
            this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
        }
    }
    async handleJoinRoom(client, data) {
        const user = client.handshake?.user;
        if (!user?.userId) {
            throw new websockets_1.WsException('Unauthorized');
        }
        const { roomId } = data;
        if (!roomId) {
            throw new websockets_1.WsException('Room ID is required');
        }
        await client.join(roomId);
        if (!this.roomUsers.has(roomId)) {
            this.roomUsers.set(roomId, new Set());
        }
        this.roomUsers.get(roomId).add(user.userId);
        const roomUsers = Array.from(this.roomUsers.get(roomId))
            .filter(id => id !== user.userId)
            .map(id => this.activeUsers.get(id))
            .filter(Boolean);
        client.emit(websocket_types_1.ServerEvents.ROOM_JOINED, {
            roomId,
            users: roomUsers,
            timestamp: new Date().toISOString(),
        });
        client.to(roomId).emit(websocket_types_1.ServerEvents.USER_JOINED, {
            userId: user.userId,
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name,
            },
            roomId,
            timestamp: new Date().toISOString(),
        });
        return { success: true, roomId };
    }
    async handleLeaveRoom(client, data) {
        const user = client.handshake?.user;
        if (!user?.userId) {
            throw new websockets_1.WsException('Unauthorized');
        }
        const { roomId } = data;
        if (!roomId) {
            throw new websockets_1.WsException('Room ID is required');
        }
        await client.leave(roomId);
        if (this.roomUsers.has(roomId)) {
            this.roomUsers.get(roomId).delete(user.userId);
        }
        client.to(roomId).emit(websocket_types_1.ServerEvents.USER_LEFT, {
            userId: user.userId,
            roomId,
            timestamp: new Date().toISOString(),
        });
        return { success: true, roomId };
    }
    async handleTrackUpdate(client, update) {
        const user = client.handshake?.user;
        if (!user?.userId) {
            throw new websockets_1.WsException('Unauthorized');
        }
        const trackUpdate = {
            ...update,
            userId: user.userId,
            timestamp: Date.now(),
        };
        client.to(update.roomId).emit(websocket_types_1.ServerEvents.TRACK_UPDATE, trackUpdate);
        return { success: true };
    }
    async handleSignal(client, signal) {
        const user = client.handshake?.user;
        if (!user?.userId) {
            throw new websockets_1.WsException('Unauthorized');
        }
        const targetSocketId = this.findSocketIdByUserId(signal.to);
        if (targetSocketId) {
            this.server.to(targetSocketId).emit(websocket_types_1.ServerEvents.SIGNAL, {
                ...signal,
                from: user.userId,
            });
        }
        return { success: true };
    }
    async handlePing(client, data) {
        return {
            event: websocket_types_1.ServerEvents.PONG,
            originalTimestamp: data.timestamp,
            serverTimestamp: Date.now(),
        };
    }
    findSocketIdByUserId(userId) {
        for (const [socketId, id] of this.userSockets.entries()) {
            if (id === userId) {
                return socketId;
            }
        }
        return undefined;
    }
};
exports.RtcEnhancedGateway = RtcEnhancedGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RtcEnhancedGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.JOIN_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RtcEnhancedGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.LEAVE_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RtcEnhancedGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.TRACK_UPDATE),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RtcEnhancedGateway.prototype, "handleTrackUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.SIGNAL),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RtcEnhancedGateway.prototype, "handleSignal", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.PING),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RtcEnhancedGateway.prototype, "handlePing", null);
exports.RtcEnhancedGateway = RtcEnhancedGateway = RtcEnhancedGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)(8080, {
        cors: {
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket'],
        pingInterval: 10000,
        pingTimeout: 5000,
        allowEIO3: true,
    }),
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard, ws_throttler_guard_1.WsThrottlerGuard),
    (0, common_1.UseFilters)(ws_exception_filter_1.WsExceptionFilter)
], RtcEnhancedGateway);
//# sourceMappingURL=rtc-enhanced.gateway.js.map