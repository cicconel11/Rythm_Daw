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
const auth_module_1 = require("../auth/auth.module");
const rtc_gateway_1 = require("./rtc.gateway");
const rtc_controller_1 = require("./rtc.controller");
let RtcModule = class RtcModule {
};
exports.RtcModule = RtcModule;
exports.RtcModule = RtcModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'defaultSecret',
                signOptions: { expiresIn: '15m' },
            }),
        ],
        controllers: [rtc_controller_1.RtcController],
        providers: [rtc_gateway_1.RtcGateway],
        exports: [rtc_gateway_1.RtcGateway],
    })
], RtcModule);
//# sourceMappingURL=rtc.module.js.map