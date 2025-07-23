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
exports.RtcController = void 0;
const common_1 = require("@nestjs/common");
const rtc_offer_dto_1 = require("./dto/rtc-offer.dto");
const rtc_answer_dto_1 = require("./dto/rtc-answer.dto");
const rtc_gateway_1 = require("./rtc.gateway");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RtcController = class RtcController {
    constructor(rtcGateway) {
        this.rtcGateway = rtcGateway;
    }
    async handleOffer(dto) {
        return { success: true };
    }
    async handleAnswer(dto) {
        return { success: true };
    }
};
exports.RtcController = RtcController;
__decorate([
    (0, common_1.Post)('offer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rtc_offer_dto_1.RtcOfferDto]),
    __metadata("design:returntype", Promise)
], RtcController.prototype, "handleOffer", null);
__decorate([
    (0, common_1.Post)('answer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rtc_answer_dto_1.RtcAnswerDto]),
    __metadata("design:returntype", Promise)
], RtcController.prototype, "handleAnswer", null);
exports.RtcController = RtcController = __decorate([
    (0, common_1.Controller)('rtc'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [rtc_gateway_1.RtcGateway])
], RtcController);
//# sourceMappingURL=rtc.controller.js.map