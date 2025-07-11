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
let RtcGateway = RtcGateway_1 = class RtcGateway {
    constructor() {
        this.logger = new common_1.Logger(RtcGateway_1.name);
        this.userSockets = new Map();
        this.socketToUser = new Map();
        this.rooms = new Map();
        this.userRooms = new Map();
    }
    async handleConnection(client) {
        try {
            const user = client.handshake.user;
            if (!user?.userId) {
                this.logger.warn('Missing user in handshake – disconnecting', RtcGateway_1.name);
                client.disconnect();
                return;
            }
            const { userId, email } = user;
            this.logger.log(`[RtcGateway] Client connected: ${client.id} (User: ${userId})`);
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId)?.add(client.id);
            this.socketToUser.set(client.id, userId);
            const userRooms = this.getUserRooms(userId);
            for (const roomId of userRooms) {
                try {
                    await client.join(roomId);
                    client.to(roomId).emit('rtc:user-reconnected', {
                        userId,
                        roomId
                    });
                }
                catch (error) {
                    this.logger.error(`Error joining room ${roomId}:`, error);
                }
            }
            const onlineUsers = Array.from(this.userSockets.keys())
                .filter(id => id !== userId);
            client.emit('rtc:online-users', { users: onlineUsers });
            client.emit('rtc:connection-success', {
                userId,
                socketId: client.id,
                email: user.email,
                name: user.name
            });
            this.logger.log(`Client ${client.id} (${email}) connection established`);
        }
        catch (error) {
            this.logger.error('Error in handleConnection:', error);
            try {
                client.disconnect(true);
            }
            catch (disconnectError) {
                this.logger.error('Error disconnecting client:', disconnectError);
            }
        }
    }
    async handleDisconnect(client) {
        const userId = this.socketToUser.get(client.id);
        if (!userId)
            return;
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.delete(client.id);
            if (sockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
        this.socketToUser.delete(client.id);
        this.logger.log(`[RtcGateway] Client disconnected: ${client.id} (User: ${userId})`);
    }
    async handleJoinRoom(client, data) {
        try {
            const userId = this.socketToUser.get(client.id);
            if (!userId)
                throw new Error('User not authenticated');
            const { roomId } = data;
            if (!roomId)
                throw new Error('Room ID is required');
            if (!this.rooms.has(roomId)) {
                this.rooms.set(roomId, new Set());
            }
            this.rooms.get(roomId)?.add(userId);
            if (!this.userRooms.has(userId)) {
                this.userRooms.set(userId, new Set());
            }
            this.userRooms.get(userId)?.add(roomId);
            await client.join(roomId);
            client.to(roomId).emit('rtc:user-joined', {
                roomId,
                userId,
                users: Array.from(this.rooms.get(roomId) || []).filter(id => id !== userId)
            });
            return { success: true, roomId };
        }
        catch (error) {
            this.logger.error('Error joining room:', error);
            return { success: false, error: error.message };
        }
    }
    async handleLeaveRoom(client, data) {
        try {
            const userId = this.socketToUser.get(client.id);
            if (!userId)
                throw new Error('User not authenticated');
            const { roomId } = data;
            if (!roomId)
                throw new Error('Room ID is required');
            this.rooms.get(roomId)?.delete(userId);
            this.userRooms.get(userId)?.delete(roomId);
            if (this.rooms.get(roomId)?.size === 0) {
                this.rooms.delete(roomId);
            }
            await client.leave(roomId);
            client.to(roomId).emit('rtc:user-left', { roomId, userId });
            return { success: true };
        }
        catch (error) {
            this.logger.error('Error leaving room:', error);
            return { success: false, error: error.message };
        }
    }
    handleOffer(client, data) {
        const from = this.socketToUser.get(client.id);
        if (!from)
            return;
        const { to, offer } = data;
        if (!to || !offer)
            return;
        this.sendToUser(to, 'rtc:offer', { from, offer });
    }
    handleAnswer(client, data) {
        const from = this.socketToUser.get(client.id);
        if (!from)
            return;
        const { to, answer } = data;
        if (!to || !answer)
            return;
        this.sendToUser(to, 'rtc:answer', { from, answer });
    }
    handleIceCandidate(client, data) {
        const from = this.socketToUser.get(client.id);
        if (!from)
            return;
        const { to, candidate } = data;
        if (!to || !candidate)
            return;
        this.sendToUser(to, 'rtc:ice-candidate', { from, candidate });
    }
    getUserRooms(userId) {
        return this.userRooms.get(userId) || new Set();
    }
    sendToUser(userId, event, data) {
        const sockets = this.userSockets.get(userId);
        if (!sockets || sockets.size === 0) {
            this.logger.warn(`No sockets found for user ${userId} when trying to send ${event}`);
            return;
        }
        for (const socketId of sockets) {
            this.server.to(socketId).emit(event, data);
        }
    }
    getUserSockets() {
        return this.userSockets;
    }
    getSocketToUser() {
        return this.socketToUser;
    }
    getLogger() {
        return this.logger;
    }
    registerWsServer(server) {
        this.server = server;
    }
    emitToUser(userId, event, payload) {
        const sockets = this.userSockets.get(userId);
        if (!sockets || sockets.size === 0 || !this.server?.sockets?.sockets) {
            this.logger.warn(`Attempted to emit to user ${userId} but no sockets found`, RtcGateway_1.name);
            return false;
        }
        let success = false;
        const socketsToRemove = [];
        sockets.forEach(socketId => {
            try {
                const socket = this.server.sockets.sockets.get(socketId);
                if (socket) {
                    socket.emit(event, payload);
                    success = true;
                }
                else {
                    socketsToRemove.push(socketId);
                }
            }
            catch (error) {
                this.logger.error(`Error emitting to socket ${socketId}:`, error);
                socketsToRemove.push(socketId);
            }
        });
        if (socketsToRemove.length > 0) {
            const userSockets = this.userSockets.get(userId);
            if (userSockets) {
                socketsToRemove.forEach(socketId => {
                    userSockets.delete(socketId);
                    this.socketToUser.delete(socketId);
                });
                if (userSockets.size === 0) {
                    this.userSockets.delete(userId);
                }
            }
        }
        return success;
    }
};
exports.RtcGateway = RtcGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RtcGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('rtc:join-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rtc:leave-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RtcGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rtc:offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RtcGateway.prototype, "handleOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rtc:answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RtcGateway.prototype, "handleAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rtc:ice-candidate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RtcGateway.prototype, "handleIceCandidate", null);
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