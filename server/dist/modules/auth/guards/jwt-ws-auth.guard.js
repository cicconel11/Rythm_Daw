"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtWsAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const websockets_1 = require("@nestjs/websockets");
let JwtWsAuthGuard = class JwtWsAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    getRequest(context) {
        const client = context.switchToWs().getClient();
        const token = client.handshake?.auth?.token ||
            client.handshake?.query?.token;
        if (!token) {
            throw new websockets_1.WsException('Missing authentication token');
        }
        return {
            headers: {
                authorization: `Bearer ${token}`,
            },
        };
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new websockets_1.WsException('Unauthorized');
        }
        return user;
    }
    canActivate(context) {
        return super.canActivate(context);
    }
};
exports.JwtWsAuthGuard = JwtWsAuthGuard;
exports.JwtWsAuthGuard = JwtWsAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtWsAuthGuard);
//# sourceMappingURL=jwt-ws-auth.guard.js.map