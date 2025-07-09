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
exports.QosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../../common/decorators/get-user.decorator");
const qos_service_1 = require("./qos.service");
const webrtc_metric_dto_1 = require("./dto/webrtc-metric.dto");
const crash_report_dto_1 = require("./dto/crash-report.dto");
let QosController = class QosController {
    constructor(qosService) {
        this.qosService = qosService;
    }
    async recordWebRtcMetrics(dto, user) {
        const metricWithUserId = {
            ...dto,
            userId: user?.sub || dto.userId
        };
        await this.qosService.recordWebRtcMetrics(metricWithUserId);
        return { success: true, message: 'Metrics accepted for processing' };
    }
    async recordCrashReport(dto, user, req) {
        const enhancedReport = {
            ...dto,
            userAgent: dto.userAgent || req.headers['user-agent'],
        };
        await this.qosService.recordCrashReport(enhancedReport, user?.sub);
        return { success: true, message: 'Crash report submitted' };
    }
};
__decorate([
    (0, common_1.Post)('webrtc'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Record WebRTC metrics',
        description: 'Records WebRTC connection quality metrics for monitoring and analytics.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'Metrics accepted for processing'
    }),
    (0, swagger_1.ApiBody)({
        type: webrtc_metric_dto_1.WebRtcMetricDto,
        examples: {
            basic: {
                summary: 'Basic WebRTC metrics',
                value: {
                    peerConnectionId: 'pc_1234567890',
                    rttMs: 45.2,
                    jitterMs: 2.5,
                    packetLoss: 1.2,
                    networkType: 'wifi',
                    effectiveType: '4g',
                    downlinkMbps: 10.5
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [webrtc_metric_dto_1.WebRtcMetricDto, Object]),
    __metadata("design:returntype", Promise)
], QosController.prototype, "recordWebRtcMetrics", null);
__decorate([
    (0, common_1.Post)('crash'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit a crash report',
        description: 'Submits a crash report with encrypted stack trace and diagnostic information.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'Crash report accepted'
    }),
    (0, swagger_1.ApiBody)({
        type: crash_report_dto_1.CrashReportDto,
        examples: {
            basic: {
                summary: 'Basic crash report',
                value: {
                    type: 'uncaught',
                    name: 'TypeError',
                    message: 'Cannot read property of undefined',
                    stack: 'TypeError: Cannot read property of undefined\n    at App.componentWillMount (webpack-internal:///./src/App.js:24:7)',
                    platform: 'web',
                    os: 'Windows 10',
                    browser: 'Chrome 91.0.4472.124',
                    url: 'https://example.com/dashboard',
                    memoryUsage: {
                        jsHeapSizeLimit: 2330000000,
                        usedJSHeapSize: 12345678,
                        totalJSHeapSize: 23456789
                    }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crash_report_dto_1.CrashReportDto, Object, Object]),
    __metadata("design:returntype", Promise)
], QosController.prototype, "recordCrashReport", null);
QosController = __decorate([
    (0, swagger_1.ApiTags)('QoS'),
    (0, common_1.Controller)('api/qos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [qos_service_1.QosService])
], QosController);
exports.QosController = QosController;
//# sourceMappingURL=qos.controller.js.map