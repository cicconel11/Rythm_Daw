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
exports.CrashReportDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CrashReportDto {
}
exports.CrashReportDto = CrashReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of the crash/error',
        example: 'uncaught',
        enum: ['uncaught', 'unhandledrejection', 'window_error', 'promise_rejection', 'resource_error', 'other'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['uncaught', 'unhandledrejection', 'window_error', 'promise_rejection', 'resource_error', 'other']),
    __metadata("design:type", String)
], CrashReportDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error name',
        example: 'TypeError',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message',
        example: 'Cannot read property of undefined',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stack trace (will be encrypted)',
        example: 'TypeError: Cannot read property of undefined\n    at App.componentWillMount (webpack-internal:///./src/App.js:24:7)',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "stack", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Platform where the crash occurred',
        example: 'web',
        enum: ['web', 'windows', 'macos', 'linux', 'ios', 'android'],
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['web', 'windows', 'macos', 'linux', 'ios', 'android']),
    __metadata("design:type", String)
], CrashReportDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operating system name and version',
        example: 'Windows 10',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "os", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Browser name and version',
        example: 'Chrome 91.0.4472.124',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "browser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User agent string',
        example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL where the crash occurred',
        example: 'https://example.com/dashboard',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Memory usage at crash time',
        example: { jsHeapSizeLimit: 2330000000, usedJSHeapSize: 12345678, totalJSHeapSize: 23456789 },
        required: false,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CrashReportDto.prototype, "memoryUsage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Breadcrumbs leading to the crash (will be encrypted)',
        example: [
            { type: 'navigation', data: { from: '/', to: '/dashboard' }, timestamp: 1624567890 },
            { type: 'click', data: { id: 'save-button' }, timestamp: 1624567891 }
        ],
        required: false,
    }),
    (0, class_validator_1.IsObject)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CrashReportDto.prototype, "breadcrumbs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional context (will be encrypted)',
        example: { userId: 'user_123', projectId: 'proj_456' },
        required: false,
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CrashReportDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional project ID',
        example: 'proj_123',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CrashReportDto.prototype, "projectId", void 0);
//# sourceMappingURL=crash-report.dto.js.map