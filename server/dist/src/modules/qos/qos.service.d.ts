import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebRtcMetricDto } from './dto/webrtc-metric.dto';
import { CrashReportDto } from './dto/crash-report.dto';
import { EncryptionService } from './encryption.service';
import { ConfigService } from '@nestjs/config';
export declare class QosService implements OnModuleInit {
    private prisma;
    private encryptionService;
    private configService;
    private readonly logger;
    private readonly BATCH_SIZE;
    private webRtcMetricsQueue;
    private flushTimer;
    private readonly FLUSH_INTERVAL;
    constructor(prisma: PrismaService, encryptionService: EncryptionService, configService: ConfigService);
    onModuleInit(): void;
    recordWebRtcMetrics(metric: WebRtcMetricDto, userId?: string): Promise<void>;
    recordCrashReport(report: CrashReportDto, userId?: string): Promise<void>;
    getWebRtcMetrics(options: {
        userId?: string;
        projectId?: string;
        startDate: Date;
        endDate: Date;
        limit?: number;
    }): Promise<any>;
    getCrashReports(options: {
        userId?: string;
        projectId?: string;
        startDate: Date;
        endDate: Date;
        type?: string;
        limit?: number;
        includeSensitive?: boolean;
    }): Promise<any>;
    private flushWebRtcMetrics;
    private scheduleFlush;
    onModuleDestroy(): Promise<void>;
}
