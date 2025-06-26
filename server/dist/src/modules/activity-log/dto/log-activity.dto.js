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
exports.LogActivityDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LogActivityDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The project ID this activity is related to' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LogActivityDto.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The user ID who performed the activity' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LogActivityDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The type of activity/event',
        examples: ['project.create', 'project.update', 'file.upload', 'file.delete', 'user.join', 'user.leave']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)([
        'project.create', 'project.update', 'project.delete',
        'file.upload', 'file.update', 'file.delete',
        'user.join', 'user.leave', 'user.role_change',
        'snapshot.create', 'snapshot.restore', 'snapshot.delete',
        'comment.create', 'comment.update', 'comment.delete',
        'settings.update', 'collaboration.start', 'collaboration.end'
    ]),
    __metadata("design:type", String)
], LogActivityDto.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional data related to the activity',
        type: 'object',
        required: false,
        example: { filename: 'drum_loop.wav', size: 1024 }
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], LogActivityDto.prototype, "payload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'IP address of the client',
        required: false,
        example: '192.168.1.1'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LogActivityDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User agent string of the client',
        required: false,
        example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LogActivityDto.prototype, "userAgent", void 0);
exports.LogActivityDto = LogActivityDto;
//# sourceMappingURL=log-activity.dto.js.map