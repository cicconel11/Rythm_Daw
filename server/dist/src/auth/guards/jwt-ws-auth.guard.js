"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var JwtWsAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtWsAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const websockets_1 = require("@nestjs/websockets");
let JwtWsAuthGuard = JwtWsAuthGuard_1 = class JwtWsAuthGuard extends (0, passport_1.AuthGuard)('ws-jwt') {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(JwtWsAuthGuard_1.name);
    }
    getRequest(context) {
        const ctx = context.switchToWs();
        const client = ctx.getClient();
        const request = {
            headers: {
                authorization: client.handshake?.auth?.token ||
                    client.handshake?.headers?.authorization ||
                    '',
            },
            _socket: client,
        };
        return request;
    }
    handleRequest(err, user, info, context) {
        if (err || !user) {
            const errorMessage = info?.message || 'Unauthorized';
            this.logger.warn(`WebSocket authentication failed: ${errorMessage}`);
            throw new websockets_1.WsException(errorMessage);
        }
        try {
            const client = context.switchToWs().getClient();
            client.user = user;
            if (client.handshake) {
                client.handshake.user = user;
            }
            return user;
        }
        catch (error) {
            this.logger.error('Error in WebSocket authentication:', error);
            throw new websockets_1.WsException('Authentication failed');
        }
    }
};
exports.JwtWsAuthGuard = JwtWsAuthGuard;
exports.JwtWsAuthGuard = JwtWsAuthGuard = JwtWsAuthGuard_1 = __decorate([
    (0, common_1.Injectable)()
], JwtWsAuthGuard);
//# sourceMappingURL=jwt-ws-auth.guard.js.map