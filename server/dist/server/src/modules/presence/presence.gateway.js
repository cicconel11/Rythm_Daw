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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const ws_jwt_auth_guard_1 = require("../auth/guards/ws-jwt-auth.guard");
const presence_service_1 = require("./presence.service");
let PresenceGateway = class PresenceGateway {
    constructor(presenceService) {
        this.presenceService = presenceService;
        this.userSockets = new Map();
        this.projectRooms = new Map();
    }
    handleConnection(client) {
        const userId = client.user?.sub;
        if (userId) {
            this.userSockets.set(client.id, userId);
            client.join(`user:${userId}`);
            const projectId = client.handshake.query.projectId;
            if (projectId) {
                this.joinProjectRoom(client, projectId);
            }
        }
    }
    handleDisconnect(client) {
        const userId = this.userSockets.get(client.id);
        if (userId) {
            this.projectRooms.forEach((clients, projectId) => {
                if (clients.has(client.id)) {
                    clients.delete(client.id);
                    client.leave(`project:${projectId}`);
                    if (clients.size === 0) {
                        this.projectRooms.delete(projectId);
                    }
                    else {
                        this.server.to(`project:${projectId}`).emit('presence-left', { userId, projectId });
                    }
                }
            });
            this.userSockets.delete(client.id);
        }
    }
    async joinProjectRoom(client, projectId) {
        const userId = this.userSockets.get(client.id);
        if (!userId)
            return;
        this.leaveAllProjectRooms(client);
        client.join(`project:${projectId}`);
        if (!this.projectRooms.has(projectId)) {
            this.projectRooms.set(projectId, new Set());
        }
        this.projectRooms.get(projectId)?.add(client.id);
        const isOnline = await this.presenceService.getUserPresence(userId);
        this.server.to(`project:${projectId}`).emit('presence-joined', {
            userId,
            status: isOnline ? 'online' : 'offline',
            user: {
                id: userId,
                name: 'User',
                email: 'user@example.com',
            },
            projectId,
        });
        const currentPresence = await this.presenceService.getProjectPresence(projectId);
        client.emit('presence-sync', currentPresence);
    }
    leaveAllProjectRooms(client) {
        const userId = this.userSockets.get(client.id);
        if (!userId)
            return;
        this.projectRooms.forEach((clients, projectId) => {
            if (clients.has(client.id)) {
                clients.delete(client.id);
                client.leave(`project:${projectId}`);
                if (clients.size === 0) {
                    this.projectRooms.delete(projectId);
                }
                else {
                    this.server.to(`project:${projectId}`).emit('presence-left', { userId, projectId });
                }
            }
        });
    }
    broadcastPresenceUpdate(projectId, data) {
        this.server.to(`project:${projectId}`).emit('presence-update', data);
    }
};
exports.PresenceGateway = PresenceGateway;
exports.PresenceGateway = PresenceGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'presence',
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? process.env.FRONTEND_URL
                : 'http://localhost:3000',
            credentials: true,
        },
    }),
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard),
    __metadata("design:paramtypes", [presence_service_1.PresenceService])
], PresenceGateway);
//# sourceMappingURL=presence.gateway.js.map