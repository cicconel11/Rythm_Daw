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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_jwt_guard_1 = require("../auth/guards/ws-jwt.guard");
const presence_service_1 = require("../presence/presence.service");
const rtc_gateway_1 = require("../rtc/rtc.gateway");
let ChatGateway = class ChatGateway {
    constructor(presenceService, rtc) {
        this.presenceService = presenceService;
        this.rtc = rtc;
    }
    onModuleInit() {
        this.rtc.registerWsServer(this.server);
    }
    async handleConnection(client) {
        const user = client.data?.user;
        if (user) {
            this.presenceService.updateUserPresence(user.userId);
            this.server.emit('userOnline', { userId: user.userId });
        }
    }
    async handleDisconnect(client) {
        const user = client.data?.user;
        if (user) {
            this.server.emit('userOffline', { userId: user.userId });
        }
    }
    handleMessage(client, data) {
        const user = client.data?.user;
        if (!user)
            return;
        const message = {
            from: user.userId,
            to: data.to,
            content: data.content,
            timestamp: new Date().toISOString(),
        };
        if (data.to.startsWith('room:')) {
            this.server.to(data.to).emit('message', message);
        }
        else {
            this.server.to(data.to).emit('message', message);
        }
        return message;
    }
    handleTyping(client, data) {
        const user = client.data?.user;
        if (!user)
            return;
        this.server.to(data.to).emit('typing', {
            from: user.userId,
            isTyping: data.isTyping,
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            credentials: true,
        },
        pingInterval: 25000,
        pingTimeout: 10000,
    }),
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtGuard),
    __metadata("design:paramtypes", [presence_service_1.PresenceService,
        rtc_gateway_1.RtcGateway])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map