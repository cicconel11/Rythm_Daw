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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingController = void 0;
const common_1 = require("@nestjs/common");
let PingController = class PingController {
    ping(res) {
        res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';");
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Powered-By', 'RHYTHM');
        res.status(200).send({ status: 'ok' });
    }
};
exports.PingController = PingController;
__decorate([
    (0, common_1.Get)('ping'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PingController.prototype, "ping", null);
exports.PingController = PingController = __decorate([
    (0, common_1.Controller)('api')
], PingController);
//# sourceMappingURL=ping.controller.js.map