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
var RtcGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtcGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_ws_auth_guard_1 = require("../../auth/guards/jwt-ws-auth.guard");
const ws_exception_filter_1 = require("../../common/filters/ws-exception.filter");
const websocket_types_1 = require("./types/websocket.types");
let RtcGateway = RtcGateway_1 = class RtcGateway {
    constructor() {
        this.logger = new common_1.Logger(RtcGateway_1.name);
        this.userSockets = new Map();
        this.socketToUser = new Map();
        this.userRooms = new Map();
        this.roomUsers = new Map();
        this.userPresence = new Map();
        this.lastSeen = new Map();
        this.missedPings = new Map();
        this.MAX_MISSED_PINGS = 3;
    }
    get activeConnections() {
        return this.socketToUser.size;
    }
    get activeRooms() {
        return this.roomUsers.size;
    }
    get activeUsers() {
        return this.userSockets.size;
    }
    onModuleInit() {
        this.setupPingInterval();
    }
    setupPingInterval() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        this.pingInterval = setInterval(() => {
            const now = Date.now();
            const disconnectedSockets = [];
            this.missedPings.forEach((count, socketId) => {
                if (count >= this.MAX_MISSED_PINGS) {
                    disconnectedSockets.push(socketId);
                }
                else {
                    this.missedPings.set(socketId, count + 1);
                }
            });
            disconnectedSockets.forEach(socketId => {
                const socket = this.server.sockets.sockets.get(socketId);
                if (socket) {
                    socket.disconnect(true);
                }
            });
        }, 10000);
    }
    async handleConnection(client) {
        try {
            const user = client.handshake.user;
            if (!user || !user.userId) {
                throw new websockets_1.WsException('Unauthorized: Missing or invalid user information');
            }
            const { userId } = user;
            const socketId = client.id;
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
                this.userRooms.set(userId, new Set());
            }
            this.userSockets.get(userId)?.add(socketId);
            this.socketToUser.set(socketId, userId);
            this.missedPings.set(socketId, 0);
            this.userPresence.set(userId, true);
            this.lastSeen.set(userId, new Date());
            client.emit(websocket_types_1.ServerEvents.CONNECT, {
                userId,
                socketId,
                timestamp: new Date().toISOString(),
            });
            this.logger.log(`Client connected: ${socketId} (User: ${userId})`);
        }
        catch (error) {
            this.logger.error('Connection error:', error);
            client.emit(websocket_types_1.ServerEvents.ERROR, {
                code: 'CONNECTION_ERROR',
                message: error.message || 'Connection error',
            });
            client.disconnect(true);
        }
    }
    async handleDisconnect(client) {
        const socketId = client.id;
        const userId = this.socketToUser.get(socketId);
        if (!userId) {
            this.logger.warn(`Disconnected untracked socket: ${socketId}`);
            return;
        }
        this.socketToUser.delete(socketId);
        this.missedPings.delete(socketId);
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
            userSockets.delete(socketId);
            if (userSockets.size === 0) {
                this.userSockets.delete(userId);
                this.userPresence.set(userId, false);
                this.lastSeen.set(userId, new Date());
                const userRooms = this.userRooms.get(userId) || new Set();
                userRooms.forEach(roomId => {
                    this.leaveRoom(userId, roomId);
                });
                this.userRooms.delete(userId);
            }
        }
        this.logger.log(`Client disconnected: ${socketId} (User: ${userId})`);
    }
    async handleJoinRoom(client, data) {
        const { roomId } = data;
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        await client.join(roomId);
        if (!this.roomUsers.has(roomId)) {
            this.roomUsers.set(roomId, new Set());
        }
        this.roomUsers.get(roomId)?.add(userId);
        this.userRooms.get(userId)?.add(roomId);
        client.emit(websocket_types_1.ServerEvents.ROOM_JOINED, { roomId });
        client.to(roomId).emit(websocket_types_1.ServerEvents.USER_JOINED, {
            roomId,
            userId,
            timestamp: new Date().toISOString(),
        });
        this.logger.log(`User ${userId} joined room ${roomId}`);
    }
    async handleLeaveRoom(client, data) {
        const { roomId } = data;
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        await this.leaveRoom(userId, roomId);
    }
    async leaveRoom(userId, roomId) {
        this.server.in(roomId).socketsLeave(userId);
        this.roomUsers.get(roomId)?.delete(userId);
        this.userRooms.get(userId)?.delete(roomId);
        if (this.roomUsers.get(roomId)?.size === 0) {
            this.roomUsers.delete(roomId);
        }
        this.server.to(roomId).emit(websocket_types_1.ServerEvents.USER_LEFT, {
            roomId,
            userId,
            timestamp: new Date().toISOString(),
        });
        this.logger.log(`User ${userId} left room ${roomId}`);
    }
    async handleTrackUpdate(client, update) {
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        const trackUpdate = {
            ...update,
            userId,
            timestamp: Date.now(),
        };
        client.to(update.roomId).emit(websocket_types_1.ServerEvents.TRACK_UPDATE, trackUpdate);
    }
    async handlePresenceUpdate(client, update) {
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        this.userPresence.set(userId, update.status === 'online');
        this.lastSeen.set(userId, new Date());
        const userRooms = this.userRooms.get(userId) || new Set();
        userRooms.forEach(roomId => {
            this.server.to(roomId).emit(websocket_types_1.ServerEvents.PRESENCE_UPDATE, {
                userId,
                status: update.status,
                lastSeen: this.lastSeen.get(userId),
            });
        });
    }
    async handleSignal(client, signal) {
        const fromUserId = this.socketToUser.get(client.id);
        if (!fromUserId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        const targetSockets = this.userSockets.get(signal.to) || new Set();
        if (targetSockets.size === 0) {
            throw new websockets_1.WsException('Target user not found or offline');
        }
        const signalWithFrom = { ...signal, from: fromUserId };
        targetSockets.forEach(socketId => {
            const targetSocket = this.server.sockets.sockets.get(socketId);
            if (targetSocket) {
                targetSocket.emit('signal', signalWithFrom);
            }
        });
    }
    handlePing(client) {
        const socketId = client.id;
        this.missedPings.set(socketId, 0);
        client.emit('pong', { timestamp: Date.now() });
    }
    onModuleDestroy() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
    }
};
exports.RtcGateway = RtcGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RtcGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.JOIN_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.LEAVE_ROOM),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.TRACK_UPDATE),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handleTrackUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.PRESENCE_UPDATE),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handlePresenceUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('signal'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handleSignal", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RtcGateway.prototype, "handlePing", null);
exports.RtcGateway = RtcGateway = RtcGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: true,
    }),
    (0, websockets_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard),
    (0, websockets_1.UseFilters)(ws_exception_filter_1.WsExceptionFilter)
], RtcGateway);
//# sourceMappingURL=rtc.gateway.new.js.map