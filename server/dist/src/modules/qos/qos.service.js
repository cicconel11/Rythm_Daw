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
var QosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const encryption_service_1 = require("./encryption.service");
const config_1 = require("@nestjs/config");
let QosService = QosService_1 = class QosService {
    constructor(prisma, encryptionService, configService) {
        this.prisma = prisma;
        this.encryptionService = encryptionService;
        this.configService = configService;
        this.logger = new common_1.Logger(QosService_1.name);
        this.BATCH_SIZE = 100;
        this.webRtcMetricsQueue = [];
        this.FLUSH_INTERVAL = 5000;
    }
    onModuleInit() {
        this.scheduleFlush();
    }
    async recordWebRtcMetrics(metric, userId) {
        this.webRtcMetricsQueue.push({
            ...metric,
            userId,
            timestamp: new Date(),
        });
        if (this.webRtcMetricsQueue.length >= this.BATCH_SIZE) {
            await this.flushWebRtcMetrics();
        }
    }
    async recordCrashReport(report, userId) {
        const { stack, breadcrumbs, context, ...rest } = report;
        try {
            const data = {
                ...rest,
                stack: stack ? this.encryptionService.encrypt(stack) : null,
                breadcrumbs: breadcrumbs
                    ? this.encryptionService.encrypt(JSON.stringify(breadcrumbs))
                    : null,
                context: context
                    ? this.encryptionService.encrypt(JSON.stringify(context))
                    : null,
                userId,
                createdAt: new Date(),
            };
            Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
            await this.prisma.crashReport.create({
                data,
            });
            this.logger.log(`Crash report recorded for user ${userId || 'anonymous'}`);
        }
        catch (error) {
            this.logger.error('Failed to record crash report', error.stack);
        }
    }
    async getWebRtcMetrics(options) {
        const { userId, startDate, endDate, limit = 1000 } = options;
        const where = {
            userId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (options.projectId) {
            where.metadata = {
                path: ['projectId'],
                equals: options.projectId,
            };
        }
        return this.prisma.webRtcMetric.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    }
    async getCrashReports(options) {
        const { userId, startDate, endDate, type, limit = 100, includeSensitive = false } = options;
        const where = {
            userId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (type) {
            where.error = {
                contains: type,
                mode: 'insensitive',
            };
        }
        if (options.projectId) {
            where.metadata = {
                path: ['projectId'],
                equals: options.projectId,
            };
        }
        const reports = await this.prisma.crashReport.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
        if (includeSensitive) {
            return reports.map(report => {
                const decrypted = { ...report };
                if (report.metadata && typeof report.metadata === 'object' && 'stack' in report.metadata) {
                    decrypted.stack = this.encryptionService.decrypt(report.metadata.stack);
                }
                if (report.metadata && typeof report.metadata === 'object' && 'breadcrumbs' in report.metadata) {
                    decrypted.breadcrumbs = JSON.parse(this.encryptionService.decrypt(report.metadata.breadcrumbs));
                }
                if (report.metadata && typeof report.metadata === 'object' && 'context' in report.metadata) {
                    decrypted.context = JSON.parse(this.encryptionService.decrypt(report.metadata.context));
                }
                return decrypted;
            });
        }
        return reports;
    }
    async flushWebRtcMetrics() {
        if (this.webRtcMetricsQueue.length === 0)
            return;
        const batch = this.webRtcMetricsQueue.splice(0, this.BATCH_SIZE);
        try {
            const metricsByType = batch.reduce((acc, metric) => {
                const metricType = metric.metricType || 'unknown';
                if (!acc[metricType]) {
                    acc[metricType] = [];
                }
                acc[metricType].push(metric);
                return acc;
            }, {});
            const createPromises = [];
            for (const [metricType, metrics] of Object.entries(metricsByType)) {
                const chunkSize = 100;
                for (let i = 0; i < metrics.length; i += chunkSize) {
                    const chunk = metrics.slice(i, i + chunkSize);
                    const createPromise = this.prisma.webRtcMetric.createMany({
                        data: chunk.map((m) => {
                            const metadata = {
                                ...(m.metadata || {}),
                                peerConnectionId: m.peerConnectionId,
                                rttMs: m.rttMs,
                                jitterMs: m.jitterMs,
                                packetLoss: m.packetLoss,
                                networkType: m.networkType,
                                effectiveType: m.effectiveType,
                                downlinkMbps: m.downlinkMbps,
                                iceCandidatePairId: m.iceCandidatePairId,
                                localCandidateId: m.localCandidateId,
                                remoteCandidateId: m.remoteCandidateId,
                            };
                            if (m.projectId) {
                                metadata.projectId = m.projectId;
                            }
                            return {
                                id: m.id || undefined,
                                metricType,
                                value: m.value || 0,
                                metadata,
                                timestamp: m.timestamp || new Date(),
                                userId: m.userId,
                            };
                        })
                    });
                    createPromises.push(createPromise);
                }
            }
            await Promise.all(createPromises);
            this.logger.debug(`Flushed ${batch.length} WebRTC metrics to database`);
        }
        catch (error) {
            this.logger.error('Failed to flush WebRTC metrics', error.stack);
            this.webRtcMetricsQueue.unshift(...batch);
        }
    }
    scheduleFlush() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
        }
        this.flushTimer = setTimeout(async () => {
            await this.flushWebRtcMetrics();
            this.scheduleFlush();
        }, this.FLUSH_INTERVAL);
        this.flushTimer.unref();
    }
    async onModuleDestroy() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
        }
        if (this.webRtcMetricsQueue.length > 0) {
            await this.flushWebRtcMetrics();
        }
    }
};
QosService = QosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        encryption_service_1.EncryptionService,
        config_1.ConfigService])
], QosService);
exports.QosService = QosService;
//# sourceMappingURL=qos.service.js.map