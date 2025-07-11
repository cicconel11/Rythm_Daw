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
let QosService = QosService_1 = class QosService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(QosService_1.name);
        this.webRtcMetricsQueue = [];
        this.flushTimer = null;
        this.BATCH_SIZE = 100;
        this.FLUSH_INTERVAL = 5000;
    }
    onModuleInit() {
        this.logger.log('QoS Service initialized');
        this.scheduleFlush();
    }
    async onModuleDestroy() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }
        if (this.webRtcMetricsQueue.length > 0) {
            try {
                await this.flushWebRtcMetrics();
            }
            catch (error) {
                this.logger.error('Error during final flush on shutdown:', error);
            }
        }
    }
    scheduleFlush() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
        }
        this.flushTimer = setTimeout(async () => {
            try {
                await this.flushWebRtcMetrics();
            }
            catch (error) {
                this.logger.error('Error during scheduled flush:', error);
            }
            finally {
                if (this.webRtcMetricsQueue.length > 0) {
                    this.scheduleFlush();
                }
                else {
                    this.flushTimer = null;
                }
            }
        }, this.FLUSH_INTERVAL);
        if (this.flushTimer) {
            this.flushTimer.unref();
        }
    }
    async recordWebRtcMetrics(metric) {
        try {
            const metricRecord = {
                userId: metric.userId,
                projectId: metric.projectId ?? null,
                category: metric.category,
                value: metric.value,
                peerConnectionId: metric.peerConnectionId ?? null,
                rttMs: metric.rttMs ?? null,
                jitterMs: metric.jitterMs ?? null,
                packetLoss: metric.packetLoss ?? null,
                networkType: metric.networkType ?? null,
                effectiveType: metric.effectiveType ?? null,
                downlinkMbps: metric.downlinkMbps ?? null,
                iceCandidatePairId: metric.iceCandidatePairId ?? null,
                localCandidateId: metric.localCandidateId ?? null,
                remoteCandidateId: metric.remoteCandidateId ?? null,
                metadata: metric.metadata ?? null,
                createdAt: metric.createdAt || new Date(),
            };
            this.webRtcMetricsQueue.push(metricRecord);
            if (this.webRtcMetricsQueue.length >= this.BATCH_SIZE) {
                await this.flushWebRtcMetrics();
            }
            else if (!this.flushTimer) {
                this.scheduleFlush();
            }
        }
        catch (error) {
            this.logger.error('Error recording WebRTC metric:', error);
            throw error;
        }
    }
    async flushWebRtcMetrics() {
        if (this.webRtcMetricsQueue.length === 0) {
            return;
        }
        const batch = this.webRtcMetricsQueue.splice(0, this.BATCH_SIZE);
        try {
            const records = batch.map(metric => ({
                userId: metric.userId,
                projectId: metric.projectId,
                metricType: metric.category,
                value: metric.value,
                peerConnectionId: metric.peerConnectionId,
                rttMs: metric.rttMs,
                jitterMs: metric.jitterMs,
                packetLoss: metric.packetLoss,
                networkType: metric.networkType,
                effectiveType: metric.effectiveType,
                downlinkMbps: metric.downlinkMbps,
                iceCandidatePairId: metric.iceCandidatePairId,
                localCandidateId: metric.localCandidateId,
                remoteCandidateId: metric.remoteCandidateId,
                timestamp: metric.createdAt,
                metadata: metric.metadata ? JSON.parse(JSON.stringify(metric.metadata)) : null,
            }));
            await this.prisma.$transaction([
                this.prisma.webRtcMetric.createMany({
                    data: records
                })
            ]);
            this.logger.debug(`Successfully flushed ${records.length} WebRTC metrics`);
        }
        catch (error) {
            this.webRtcMetricsQueue.unshift(...batch);
            this.logger.error('Error flushing WebRTC metrics:', error);
            throw error;
        }
    }
    async recordCrashReport(report, userId) {
        if (!userId) {
            throw new Error('User ID is required for crash reports');
        }
        try {
            const data = {
                error: report.message || report.name || 'Unknown error',
                stackTrace: report.stack || 'No stack trace available',
                stack: report.stack || null,
                breadcrumbs: report.breadcrumbs ? JSON.stringify(report.breadcrumbs) : null,
                context: report.context ? JSON.stringify({
                    ...report.context,
                    platform: report.platform,
                    os: report.os,
                    browser: report.browser,
                    userAgent: report.userAgent,
                    url: report.url,
                    memoryUsage: report.memoryUsage
                }) : null,
                userId: userId,
                projectId: report.projectId || null,
                metadata: {
                    type: report.type,
                    platform: report.platform,
                    os: report.os,
                    browser: report.browser,
                    userAgent: report.userAgent,
                    url: report.url,
                    memoryUsage: report.memoryUsage
                }
            };
            await this.prisma.crashReport.create({ data });
            this.logger.log(`Crash report recorded for user ${userId || 'anonymous'}`);
        }
        catch (error) {
            this.logger.error('Error recording crash report:', error);
            throw error;
        }
    }
    async getWebRtcMetrics(options) {
        const { userId, projectId, startDate, endDate, limit = 1000, category } = options;
        const where = {
            timestamp: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (userId)
            where.userId = userId;
        if (projectId)
            where.projectId = projectId;
        if (category)
            where.metricType = category;
        try {
            return await this.prisma.webRtcMetric.findMany({
                where,
                take: limit,
                orderBy: { timestamp: 'desc' },
            });
        }
        catch (error) {
            this.logger.error('Error fetching WebRTC metrics:', error);
            throw error;
        }
    }
    async getCrashReports(options) {
        const { userId, projectId, startDate, endDate, type, limit = 100, includeSensitive = false } = options;
        const where = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (userId)
            where.userId = userId;
        if (projectId)
            where.projectId = projectId;
        if (type)
            where.type = type;
        try {
            const reports = await this.prisma.crashReport.findMany({
                where,
                take: limit,
                orderBy: { createdAt: 'desc' },
            });
            return reports.map((report) => {
                const result = {
                    id: report.id,
                    error: report.error,
                    stack: includeSensitive ? report.stack : (report.stack ? '[REDACTED]' : null),
                    stackTrace: includeSensitive ? report.stackTrace : (report.stackTrace ? '[REDACTED]' : null),
                    userId: report.userId,
                    projectId: report.projectId,
                    createdAt: report.createdAt,
                    type: report.type || null,
                };
                if (includeSensitive) {
                    if (report.breadcrumbs) {
                        try {
                            result.breadcrumbs = typeof report.breadcrumbs === 'string'
                                ? JSON.parse(report.breadcrumbs)
                                : report.breadcrumbs;
                        }
                        catch (e) {
                            result.breadcrumbs = null;
                            this.logger.warn('Failed to parse breadcrumbs', { reportId: report.id });
                        }
                    }
                    else {
                        result.breadcrumbs = null;
                    }
                    if (report.context) {
                        try {
                            result.context = typeof report.context === 'string'
                                ? JSON.parse(report.context)
                                : report.context;
                        }
                        catch (e) {
                            result.context = null;
                            this.logger.warn('Failed to parse context', { reportId: report.id });
                        }
                    }
                    else {
                        result.context = null;
                    }
                    if (report.metadata) {
                        try {
                            const metadata = typeof report.metadata === 'string'
                                ? JSON.parse(report.metadata)
                                : report.metadata;
                            result.metadata = metadata;
                            if (metadata && typeof metadata === 'object') {
                                result.platform = metadata.platform || null;
                                result.os = metadata.os || null;
                                result.browser = metadata.browser || null;
                                result.userAgent = metadata.userAgent || null;
                                result.url = metadata.url || null;
                                result.memoryUsage = metadata.memoryUsage || null;
                            }
                        }
                        catch (e) {
                            result.metadata = null;
                            this.logger.warn('Failed to parse metadata', { reportId: report.id });
                        }
                    }
                    else {
                        result.metadata = null;
                    }
                }
                else {
                    result.breadcrumbs = report.breadcrumbs ? '[REDACTED]' : null;
                    result.context = report.context ? '[REDACTED]' : null;
                    result.metadata = report.metadata ? '[REDACTED]' : null;
                }
                return result;
            });
        }
        catch (error) {
            this.logger.error('Error fetching crash reports:', error);
            throw error;
        }
    }
};
exports.QosService = QosService;
exports.QosService = QosService = QosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QosService);
//# sourceMappingURL=qos.service.js.map