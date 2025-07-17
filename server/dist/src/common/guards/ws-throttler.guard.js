"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WsThrottlerGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const websockets_1 = require("@nestjs/websockets");
let WsThrottlerGuard = WsThrottlerGuard_1 = class WsThrottlerGuard extends throttler_1.ThrottlerGuard {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(WsThrottlerGuard_1.name);
    }
    async handleRequest(context, limit, ttl) {
        try {
            const client = context.switchToWs().getClient();
            const ip = client.handshake?.address || 'unknown';
            const key = this.generateKey(context, ip);
            const storage = this.storageService;
            const { totalHits } = await storage.increment(key, ttl);
            if (totalHits > limit) {
                this.logger.warn(`Rate limit exceeded for IP: ${ip}`);
                throw new websockets_1.WsException('Too many requests');
            }
            return true;
        }
        catch (error) {
            this.logger.error('Error in WsThrottlerGuard:', error);
            throw new websockets_1.WsException('Rate limiting error');
        }
    }
    generateKey(context, suffix) {
        const prefix = 'ws-throttle';
        const handler = context.getHandler().name;
        const classContext = context.getClass().name;
        return `${prefix}:${classContext}:${handler}:${suffix}`;
    }
};
exports.WsThrottlerGuard = WsThrottlerGuard;
exports.WsThrottlerGuard = WsThrottlerGuard = WsThrottlerGuard_1 = __decorate([
    (0, common_1.Injectable)()
], WsThrottlerGuard);
//# sourceMappingURL=ws-throttler.guard.js.map