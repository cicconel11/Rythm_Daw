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
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_ws_auth_guard_1 = require("../../auth/guards/jwt-ws-auth.guard");
const ws_exception_filter_1 = require("../../common/filters/ws-exception.filter");
const ws_throttler_guard_1 = require("../../common/guards/ws-throttler.guard");
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
        if (!client.handshake?.user) {
            this.logger.warn('Connection attempt without valid user');
            client.disconnect(true);
            return;
        }
        const user = client.handshake.user;
        client.data = {
            userId: user.userId,
            user
        };
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
            client.on('ping', () => {
                this.missedPings.set(socketId, 0);
                client.emit('pong', { timestamp: Date.now() });
            });
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
    async handleJoinRoom(client, payload) {
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        const roomId = payload?.roomId;
        if (!roomId) {
            throw new websockets_1.WsException('Room ID is required');
        }
        if (!client.handshake?.user) {
            throw new websockets_1.WsException('Unauthorized');
        }
        const joined = await this.joinRoom(userId, roomId);
        if (joined) {
            await client.join(roomId);
            client.emit(websocket_types_1.ServerEvents.ROOM_JOINED, {
                room: { id: roomId, name: roomId },
                participants: []
            });
            client.to(roomId).emit(websocket_types_1.ServerEvents.USER_JOINED, client.handshake.user);
            this.logger.log(`User ${userId} joined room ${roomId}`);
        }
    }
    async joinRoom(userId, roomId) {
        if (!roomId) {
            throw new websockets_1.WsException('Room ID is required');
        }
        if (!this.roomUsers.has(roomId)) {
            this.roomUsers.set(roomId, new Set());
        }
        const room = this.roomUsers.get(roomId);
        if (room && !room.has(userId)) {
            room.add(userId);
            this.userRooms.get(userId)?.add(roomId);
            return true;
        }
        return false;
    }
    async handleLeaveRoom(client, payload) {
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        const roomId = payload?.roomId;
        if (!roomId) {
            throw new websockets_1.WsException('Room ID is required');
        }
        if (!client.handshake?.user) {
            throw new websockets_1.WsException('Unauthorized');
        }
        const left = await this.leaveRoom(userId, roomId);
        if (left) {
            await client.leave(roomId);
            client.to(roomId).emit(websocket_types_1.ServerEvents.USER_LEFT, userId);
            this.logger.log(`User ${userId} left room ${roomId}`);
        }
    }
    async leaveRoom(userId, roomId) {
        if (!roomId) {
            throw new websockets_1.WsException('Room ID is required');
        }
        const room = this.roomUsers.get(roomId);
        if (room && room.has(userId)) {
            room.delete(userId);
            this.userRooms.get(userId)?.delete(roomId);
            if (room.size === 0) {
                this.roomUsers.delete(roomId);
            }
            return true;
        }
        return false;
    }
    async handleTrackUpdate(client, update) {
        const userId = this.socketToUser.get(client.id);
        if (!userId) {
            throw new websockets_1.WsException('User not found');
        }
        if (!update.roomId) {
            throw new websockets_1.WsException('Room ID is required');
        }
        if (!client.handshake?.user) {
            throw new websockets_1.WsException('Unauthorized');
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
            throw new websockets_1.WsException('User not found');
        }
        if (!client.handshake?.user) {
            throw new websockets_1.WsException('Unauthorized');
        }
        this.userPresence.set(userId, update.status === 'online');
        const rooms = Array.from(client.rooms).filter(room => room !== client.id);
        const currentRoom = rooms.length > 0 ? rooms[0] : null;
        if (currentRoom) {
            const presenceUpdate = {
                userId,
                status: update.status,
                lastSeen: update.lastSeen || new Date(),
                currentRoom,
            };
            client.to(currentRoom).emit(websocket_types_1.ServerEvents.PRESENCE_UPDATE, presenceUpdate);
        }
    }
    async handleSignal(client, signal) {
        const fromUserId = this.socketToUser.get(client.id);
        if (!fromUserId) {
            throw new websockets_1.WsException('User not authenticated');
        }
        if (!signal.to) {
            throw new websockets_1.WsException('Recipient ID is required');
        }
        const recipientSocket = this.findSocketByUserId(signal.to);
        if (!recipientSocket) {
            throw new websockets_1.WsException('Recipient not found');
        }
        const signalingMessage = {
            ...signal,
            from: fromUserId,
        };
        recipientSocket.emit(websocket_types_1.ServerEvents.SIGNAL, signalingMessage);
    }
    findSocketByUserId(userId) {
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
            const socketId = userSockets.values().next().value;
            if (socketId) {
                const socket = this.server.sockets.sockets.get(socketId);
                return socket;
            }
        }
        return undefined;
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
    (0, websockets_1.SubscribeMessage)(websocket_types_1.ClientEvents.SIGNAL),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handleSignal", null);
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
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard, ws_throttler_guard_1.WsThrottlerGuard),
    (0, common_1.UseFilters)(ws_exception_filter_1.WsExceptionFilter)
], RtcGateway);
//# sourceMappingURL=rtc.gateway.js.map