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
exports.WsThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
let WsThrottlerGuard = class WsThrottlerGuard {
    constructor() {
        this.logger = console;
        this.rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
            points: 100,
            duration: 1,
        });
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const ip = this.getClientIp(client);
        try {
            await this.rateLimiter.consume(`ws:${ip}`);
            return true;
        }
        catch (error) {
            this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
            throw new websockets_1.WsException('Rate limit exceeded');
        }
    }
    getClientIp(client) {
        if (client._socket && client._socket.remoteAddress) {
            return client._socket.remoteAddress;
        }
        return client.id || 'unknown';
    }
};
WsThrottlerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], WsThrottlerGuard);
exports.WsThrottlerGuard = WsThrottlerGuard;
//# sourceMappingURL=ws-throttler.guard.js.map