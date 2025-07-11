import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebRtcMetricDto } from './dto/webrtc-metric.dto';
import { CrashReportDto } from './dto/crash-report.dto';
export declare class QosService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly logger;
    private webRtcMetricsQueue;
    private flushTimer;
    private readonly BATCH_SIZE;
    private readonly FLUSH_INTERVAL;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
    private scheduleFlush;
    recordWebRtcMetrics(metric: WebRtcMetricDto): Promise<void>;
    private flushWebRtcMetrics;
    recordCrashReport(report: CrashReportDto, userId?: string): Promise<void>;
    getWebRtcMetrics(options: {
        userId?: string;
        projectId?: string;
        startDate: Date;
        endDate: Date;
        limit?: number;
        category?: string;
    }): Promise<Array<Record<string, any>>>;
    getCrashReports(options: {
        userId?: string;
        projectId?: string;
        startDate: Date;
        endDate: Date;
        type?: string;
        limit?: number;
        includeSensitive?: boolean;
    }): Promise<Array<Record<string, any>>>;
}
