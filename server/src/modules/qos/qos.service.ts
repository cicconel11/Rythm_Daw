import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebRtcMetricDto } from './dto/webrtc-metric.dto';
import { CrashReportDto } from './dto/crash-report.dto';
import { EncryptionService } from './encryption.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QosService implements OnModuleInit {
  private readonly logger = new Logger(QosService.name);
  private readonly BATCH_SIZE = 100;
  private webRtcMetricsQueue: any[] = [];
  private flushTimer: NodeJS.Timeout;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds

  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    // Start the batch processing timer
    this.scheduleFlush();
  }

  /**
   * Records WebRTC metrics
   */
  async recordWebRtcMetrics(metric: WebRtcMetricDto, userId?: string) {
    // Add to batch queue for processing
    this.webRtcMetricsQueue.push({
      ...metric,
      userId,
      timestamp: new Date(),
    });

    // Process immediately if batch size is reached
    if (this.webRtcMetricsQueue.length >= this.BATCH_SIZE) {
      await this.flushWebRtcMetrics();
    }
  }

  /**
   * Records a crash report with encrypted stack trace and context
   */
  async recordCrashReport(report: CrashReportDto, userId?: string) {
    const {
      stack,
      breadcrumbs,
      context,
      ...rest
    } = report;

    try {
      await this.prisma.crashReport.create({
        data: {
          ...rest,
          // Encrypt sensitive fields
          stack: stack ? this.encryptionService.encrypt(stack) : null,
          breadcrumbs: breadcrumbs 
            ? this.encryptionService.encrypt(JSON.stringify(breadcrumbs)) 
            : null,
          context: context 
            ? this.encryptionService.encrypt(JSON.stringify(context))
            : null,
          userId,
          timestamp: new Date(),
        },
      });

      this.logger.log(`Crash report recorded for user ${userId || 'anonymous'}`);
    } catch (error) {
      this.logger.error('Failed to record crash report', error.stack);
      // Don't throw to prevent exposing internal errors to clients
    }
  }

  /**
   * Gets WebRTC metrics for analysis
   */
  async getWebRtcMetrics(options: {
    userId?: string;
    projectId?: string;
    startDate: Date;
    endDate: Date;
    limit?: number;
  }) {
    const { userId, projectId, startDate, endDate, limit = 1000 } = options;

    return this.prisma.webRtcMetric.findMany({
      where: {
        userId,
        projectId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Gets crash reports with optional filtering
   */
  async getCrashReports(options: {
    userId?: string;
    projectId?: string;
    startDate: Date;
    endDate: Date;
    type?: string;
    limit?: number;
    includeSensitive?: boolean;
  }) {
    const { 
      userId, 
      projectId, 
      startDate, 
      endDate, 
      type, 
      limit = 100,
      includeSensitive = false 
    } = options;

    const reports = await this.prisma.crashReport.findMany({
      where: {
        userId,
        projectId,
        type,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    // Decrypt sensitive fields if requested
    if (includeSensitive) {
      return reports.map(report => ({
        ...report,
        stack: report.stack ? this.encryptionService.decrypt(report.stack) : null,
        breadcrumbs: report.breadcrumbs 
          ? JSON.parse(this.encryptionService.decrypt(report.breadcrumbs))
          : null,
        context: report.context 
          ? JSON.parse(this.encryptionService.decrypt(report.context))
          : null,
      }));
    }

    return reports;
  }

  /**
   * Flushes queued WebRTC metrics to the database
   */
  private async flushWebRtcMetrics() {
    if (this.webRtcMetricsQueue.length === 0) return;

    const batch = this.webRtcMetricsQueue.splice(0, this.BATCH_SIZE);
    
    try {
      await this.prisma.$transaction([
        this.prisma.webRtcMetric.createMany({
          data: batch.map(m => ({
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
            timestamp: m.timestamp,
            userId: m.userId,
            projectId: m.projectId,
          })),
          skipDuplicates: true,
        }),
      ]);

      this.logger.debug(`Flushed ${batch.length} WebRTC metrics to database`);
    } catch (error) {
      this.logger.error('Failed to flush WebRTC metrics', error.stack);
      // Requeue failed batch for next attempt
      this.webRtcMetricsQueue.unshift(...batch);
    }
  }

  /**
   * Schedules the next flush of WebRTC metrics
   */
  private scheduleFlush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    
    this.flushTimer = setTimeout(async () => {
      await this.flushWebRtcMetrics();
      this.scheduleFlush();
    }, this.FLUSH_INTERVAL);
    
    // Don't prevent Node.js from exiting
    this.flushTimer.unref();
  }

  /**
   * Clean up resources
   */
  async onModuleDestroy() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    
    // Flush any remaining metrics
    if (this.webRtcMetricsQueue.length > 0) {
      await this.flushWebRtcMetrics();
    }
  }
}
