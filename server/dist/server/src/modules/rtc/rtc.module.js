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
const rtc_gateway_1 = require("./rtc.gateway");
const rtc_controller_1 = require("./rtc.controller");
const ws_throttler_guard_1 = require("../../common/guards/ws-throttler.guard");
const core_1 = require("@nestjs/core");
let RtcModule = class RtcModule {
};
exports.RtcModule = RtcModule;
exports.RtcModule = RtcModule = __decorate([
    (0, common_1.Module)({
        providers: [
            rtc_gateway_1.RtcGateway,
            {
                provide: core_1.APP_GUARD,
                useClass: ws_throttler_guard_1.WsThrottlerGuard,
            },
        ],
        controllers: [rtc_controller_1.RtcController],
        exports: [rtc_gateway_1.RtcGateway],
    })
], RtcModule);
//# sourceMappingURL=rtc.module.js.map