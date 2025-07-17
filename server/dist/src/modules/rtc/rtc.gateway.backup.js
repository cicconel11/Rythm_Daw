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
        this.missedPongs = new Map();
        this.MAX_MISSED_PONGS = 2;
        this.userSockets = new Map();
        this.socketToUser = new Map();
        this.rooms = new Map();
        this.userRooms = new Map();
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
    emitToUser(userId, event, payload) {
        const sockets = this.userSockets.get(userId);
        if (!sockets || sockets.size === 0)
            return false;
        sockets.forEach(sid => this.server.to(sid).emit(event, payload));
        return true;
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
            this.server.sockets.sockets.forEach((socket) => {
                if (socket.connected && socket.handshake.user?.userId) {
                    socket.emit('ping', { timestamp: now });
                    if (!this.missedPongs.has(socket.id)) {
                        this.missedPongs.set(socket.id, 0);
                    }
                }
            });
        }, 30000);
    }
    async handleConnection(client) {
        try {
            const user = client.handshake.user;
            if (!user?.userId) {
                this.logger.warn('Missing user in handshake – disconnecting', RtcGateway_1.name);
                client.disconnect();
                return;
            }
            this.missedPongs.set(client.id, 0);
            client.on('pong', (data) => {
                if (data?.timestamp) {
                    const latency = Date.now() - data.timestamp;
                    this.logger.debug(`Pong received from ${user.userId} (${client.id}) - Latency: ${latency}ms`);
                    this.missedPongs.set(client.id, 0);
                }
            });
            const checkPongs = setInterval(() => {
                const missed = this.missedPongs.get(client.id) || 0;
                if (missed >= this.MAX_MISSED_PONGS) {
                    this.logger.warn(`Disconnecting ${user.userId} (${client.id}) - Missed ${missed} pongs`);
                    this.handleDisconnect(client);
                    client.disconnect(true);
                    clearInterval(checkPongs);
                }
                else {
                    this.missedPongs.set(client.id, missed + 1);
                }
            }, 35000);
            client.once('disconnect', () => {
                clearInterval(checkPongs);
                this.missedPongs.delete(client.id);
            });
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
        const socketId = client.id;
        const userId = this.socketToUser.get(socketId);
        this.missedPongs.delete(socketId);
        if (!userId) {
            return;
        }
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
    to(room) {
        if (this.testServer)
            return this.testServer.to(room);
        if (!this.server)
            throw new Error('WebSocket server not initialized');
        return this.server.to(room);
    }
    emit(event, ...args) {
        if (this.testServer)
            return this.testServer.emit(event, ...args);
        if (!this.server)
            throw new Error('WebSocket server not initialized');
        return this.server.emit(event, ...args);
    }
    cleanupDeadSockets(userId, socketIds) {
        if (socketIds.length === 0)
            return;
        this.logger.debug(`Cleaning up ${socketIds.length} dead sockets for user ${userId}`);
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
            socketIds.forEach(socketId => {
                userSockets.delete(socketId);
                this.socketToUser.delete(socketId);
                this.cleanupRoomAssociations(userId, socketId);
            });
            if (userSockets.size === 0) {
                this.userSockets.delete(userId);
            }
        }
    }
    cleanupRoomAssociations(userId, socketId) {
        this.userRooms.forEach((userIds, roomId) => {
            if (userIds.has(userId)) {
                userIds.delete(userId);
                if (userIds.size === 0) {
                    this.userRooms.delete(roomId);
                }
                this.notifyRoomOfUserLeave(roomId, userId, socketId);
            }
        });
    }
    notifyRoomOfUserLeave(roomId, userId, socketId) {
        try {
            const roomSockets = this.rooms.get(roomId);
            if (roomSockets) {
                roomSockets.delete(socketId);
                if (roomSockets.size === 0) {
                    this.rooms.delete(roomId);
                }
                else {
                    const leaveMessage = {
                        userId,
                        socketId,
                        roomId,
                        timestamp: new Date().toISOString()
                    };
                    this.server.to(roomId).emit('user-left', leaveMessage);
                }
            }
        }
        catch (error) {
            this.logger.error(`Error notifying room ${roomId} of user ${userId} leaving:`, error);
        }
    }
    emitToUser(userId, event, payload) {
        if (process.env.NODE_ENV === 'test') {
            const sockets = this.userSockets.get(userId);
            if (!sockets || sockets.size === 0)
                return false;
            sockets.forEach(sid => this.server.to(sid).emit(event, payload));
            return true;
        }
        if (!userId || !event) {
            this.logger.warn('Invalid parameters provided to emitToUser', { userId, event });
            return false;
        }
        const sockets = this.userSockets.get(userId);
        if (!sockets || sockets.size === 0) {
            this.logger.warn(`Attempted to emit to user ${userId} but no sockets found`, RtcGateway_1.name);
            return false;
        }
        if (!this.server?.sockets?.sockets) {
            this.logger.error('WebSocket server not properly initialized');
            return false;
        }
        let success = false;
        const socketsToRemove = [];
        const socketIds = Array.from(sockets);
        for (const socketId of socketIds) {
            try {
                const socket = this.server.sockets.sockets.get(socketId);
                if (socket && socket.connected) {
                    try {
                        socket.emit(event, payload);
                        success = true;
                    }
                    catch (emitError) {
                        this.logger.error(`Error emitting to socket ${socketId}:`, emitError);
                        socketsToRemove.push(socketId);
                    }
                }
                else {
                    socketsToRemove.push(socketId);
                }
            }
            catch (error) {
                this.logger.error(`Unexpected error processing socket ${socketId}:`, error);
                socketsToRemove.push(socketId);
            }
        }
        if (socketsToRemove.length > 0) {
            this.cleanupDeadSockets(userId, socketsToRemove);
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
            origin: process.env.CORS_ORIGIN || '*',
            credentials: true,
        },
        pingInterval: 30000,
        pingTimeout: 10000,
    }),
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard)
], RtcGateway);
//# sourceMappingURL=rtc.gateway.backup.js.map