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
exports.WebSocketModule = void 0;
const common_1 = require("@nestjs/common");
const chat_gateway_1 = require("./chat.gateway");
const ws_throttler_guard_1 = require("./guards/ws-throttler.guard");
const core_1 = require("@nestjs/core");
const jwt_ws_auth_guard_1 = require("../auth/guards/jwt-ws-auth.guard");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let WebSocketModule = class WebSocketModule {
    constructor(gateway) {
        this.gateway = gateway;
    }
    onModuleInit() {
    }
    onModuleDestroy() {
        if (this.gateway.cleanup) {
            this.gateway.cleanup();
        }
    }
};
WebSocketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            chat_gateway_1.ChatGateway,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_ws_auth_guard_1.JwtWsAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: ws_throttler_guard_1.WsThrottlerGuard,
            },
        ],
        exports: [chat_gateway_1.ChatGateway],
    }),
    __metadata("design:paramtypes", [chat_gateway_1.ChatGateway])
], WebSocketModule);
exports.WebSocketModule = WebSocketModule;
//# sourceMappingURL=websocket.module.js.map