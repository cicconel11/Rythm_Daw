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
exports.InventoryGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ws_jwt_auth_guard_1 = require("../auth/guards/ws-jwt-auth.guard");
let InventoryGateway = class InventoryGateway {
    constructor() {
        this.userSockets = new Map();
    }
    handleConnection(client) {
        const userId = client.user?.sub;
        if (userId) {
            this.userSockets.set(client.id, userId);
            client.join(`user:${userId}`);
        }
    }
    handleDisconnect(client) {
        this.userSockets.delete(client.id);
    }
    broadcastInventoryUpdate(userId, data) {
        this.server.to(`user:${userId}`).emit('inventory-updates', data);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], InventoryGateway.prototype, "server", void 0);
InventoryGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: 'inventory',
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? process.env.FRONTEND_URL
                : 'http://localhost:3000',
            credentials: true,
        },
    }),
    (0, common_1.UseGuards)(ws_jwt_auth_guard_1.WsJwtAuthGuard)
], InventoryGateway);
exports.InventoryGateway = InventoryGateway;
//# sourceMappingURL=inventory.gateway.js.map