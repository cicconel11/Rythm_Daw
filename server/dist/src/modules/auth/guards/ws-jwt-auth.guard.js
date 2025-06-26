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
exports.WsJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const websockets_1 = require("@nestjs/websockets");
const config_1 = require("@nestjs/config");
let WsJwtAuthGuard = class WsJwtAuthGuard {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const token = this.extractTokenFromSocket(client);
        if (!token) {
            throw new websockets_1.WsException('Unauthorized: No token provided');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            client['user'] = payload;
            return true;
        }
        catch (error) {
            throw new websockets_1.WsException('Unauthorized: Invalid token');
        }
    }
    extractTokenFromSocket(socket) {
        if (socket.handshake.auth?.token) {
            return socket.handshake.auth.token;
        }
        const token = socket.handshake.query?.token;
        if (token && typeof token === 'string') {
            return token;
        }
        return null;
    }
};
WsJwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], WsJwtAuthGuard);
exports.WsJwtAuthGuard = WsJwtAuthGuard;
//# sourceMappingURL=ws-jwt-auth.guard.js.map