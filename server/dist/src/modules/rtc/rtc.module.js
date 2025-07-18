"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtcModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("../auth/auth.module");
const rtc_gateway_1 = require("./rtc.gateway");
const rtc_enhanced_gateway_1 = require("./rtc-enhanced.gateway");
const rtc_controller_1 = require("./rtc.controller");
const ws_throttler_guard_1 = require("../../common/guards/ws-throttler.guard");
const core_1 = require("@nestjs/core");
let RtcModule = class RtcModule {
};
exports.RtcModule = RtcModule;
exports.RtcModule = RtcModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET', 'defaultSecret'),
                    signOptions: { expiresIn: '15m' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [rtc_controller_1.RtcController],
        providers: [
            rtc_gateway_1.RtcGateway,
            rtc_enhanced_gateway_1.RtcEnhancedGateway,
            {
                provide: core_1.APP_GUARD,
                useClass: ws_throttler_guard_1.WsThrottlerGuard,
            },
        ],
        exports: [rtc_gateway_1.RtcGateway, rtc_enhanced_gateway_1.RtcEnhancedGateway],
    })
], RtcModule);
//# sourceMappingURL=rtc.module.js.map