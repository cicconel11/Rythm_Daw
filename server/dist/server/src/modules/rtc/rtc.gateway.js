"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RtcGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtcGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const jwt_ws_auth_guard_1 = require("../auth/guards/jwt-ws-auth.guard");
let RtcGateway = RtcGateway_1 = class RtcGateway {
    constructor() {
        this.logger = new common_1.Logger(RtcGateway_1.name);
    }
    get server() {
        return this._server;
    }
    async afterInit() {
        const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
        const subClient = pubClient.duplicate();
        await pubClient.connect();
        await subClient.connect();
        this.server.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        this.logger.log('RtcGateway initialized with Redis adapter');
    }
    handleConnection(client) {
        this.logger.log(`RTC client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`RTC client disconnected: ${client.id}`);
    }
    async handleSignal(client, payload) {
        this.logger.log(`Received signal from ${client.id}: ${JSON.stringify(payload)}`);
        this.server.emit('signal', payload);
    }
};
exports.RtcGateway = RtcGateway;
exports.RtcGateway = RtcGateway = RtcGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: '/rtc', cors: { origin: '*' } }),
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard)
], RtcGateway);
//# sourceMappingURL=rtc.gateway.js.map