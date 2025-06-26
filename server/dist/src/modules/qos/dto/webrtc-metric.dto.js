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
exports.WebRtcMetricDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class WebRtcMetricDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Peer connection ID',
        example: 'pc_1234567890',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebRtcMetricDto.prototype, "peerConnectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Round-trip time in milliseconds',
        example: 45.2,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WebRtcMetricDto.prototype, "rttMs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Jitter in milliseconds',
        example: 2.5,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WebRtcMetricDto.prototype, "jitterMs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Packet loss percentage (0-100)',
        example: 1.2,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WebRtcMetricDto.prototype, "packetLoss", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Network type',
        example: 'wifi',
        enum: ['wifi', 'cellular', 'ethernet', 'vpn', 'other'],
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['wifi', 'cellular', 'ethernet', 'vpn', 'other']),
    __metadata("design:type", String)
], WebRtcMetricDto.prototype, "networkType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Effective network type',
        example: '4g',
        enum: ['slow-2g', '2g', '3g', '4g'],
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['slow-2g', '2g', '3g', '4g']),
    __metadata("design:type", String)
], WebRtcMetricDto.prototype, "effectiveType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estimated downlink speed in Mbps',
        example: 10.5,
        required: false,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], WebRtcMetricDto.prototype, "downlinkMbps", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ICE candidate pair ID',
        example: 'ice-pair-123',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WebRtcMetricDto.prototype, "iceCandidatePairId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Local candidate ID',
        example: 'local-cand-123',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WebRtcMetricDto.prototype, "localCandidateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Remote candidate ID',
        example: 'remote-cand-123',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WebRtcMetricDto.prototype, "remoteCandidateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional project ID',
        example: 'proj_123',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WebRtcMetricDto.prototype, "projectId", void 0);
exports.WebRtcMetricDto = WebRtcMetricDto;
//# sourceMappingURL=webrtc-metric.dto.js.map