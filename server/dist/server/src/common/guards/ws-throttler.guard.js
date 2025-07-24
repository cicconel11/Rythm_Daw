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
class WsThrottlerContext {
    constructor(context) {
        this.context = context;
    }
    getRequest() {
        return this.context.switchToWs().getClient();
    }
    getResponse() {
        return this.context.switchToHttp().getResponse();
    }
    getType() {
        return 'ws';
    }
}
let WsThrottlerGuard = WsThrottlerGuard_1 = class WsThrottlerGuard extends throttler_1.ThrottlerGuard {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(WsThrottlerGuard_1.name);
    }
    async canActivate(context) {
        const wsContext = new WsThrottlerContext(context);
        try {
            const canActivate = await super.canActivate(wsContext);
            return canActivate;
        }
        catch (error) {
            if (error.getStatus?.() === 429) {
                const socket = wsContext.getRequest();
                const ip = socket.handshake.address || 'unknown';
                this.logger.warn(`WebSocket rate limit exceeded for IP: ${ip}`);
                throw new websockets_1.WsException({
                    status: 'error',
                    message: 'Too many requests',
                    retryAfter: 60,
                });
            }
            throw error;
        }
    }
    getRequestResponse(context) {
        const wsContext = new WsThrottlerContext(context);
        return {
            req: wsContext.getRequest(),
            res: wsContext.getResponse(),
        };
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