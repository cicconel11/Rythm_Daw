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
      const data: any = {
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
        // Map timestamp to createdAt if needed, or remove if not in schema
        createdAt: new Date(),
      };

      // Remove any undefined values
      Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

      await this.prisma.crashReport.create({
        data,
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
    const { userId, startDate, endDate, limit = 1000 } = options;

    const where: any = {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Add projectId to metadata if it exists
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
      startDate, 
      endDate, 
      type, 
      limit = 100,
      includeSensitive = false 
    } = options;

    const where: any = {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    // Add type filter if provided
    if (type) {
      where.error = {
        contains: type,
        mode: 'insensitive',
      };
    }

    // Add projectId to metadata if it exists
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

    // Decrypt sensitive fields if requested
    if (includeSensitive) {
      return reports.map(report => {
        const decrypted: any = { ...report };
        
        // Decrypt stack trace if it exists in metadata
        if (report.metadata && typeof report.metadata === 'object' && 'stack' in report.metadata) {
          decrypted.stack = this.encryptionService.decrypt(report.metadata.stack as string);
        }
        
        // Decrypt breadcrumbs if they exist in metadata
        if (report.metadata && typeof report.metadata === 'object' && 'breadcrumbs' in report.metadata) {
          decrypted.breadcrumbs = JSON.parse(
            this.encryptionService.decrypt(report.metadata.breadcrumbs as string)
          );
        }
        
        // Decrypt context if it exists in metadata
        if (report.metadata && typeof report.metadata === 'object' && 'context' in report.metadata) {
          decrypted.context = JSON.parse(
            this.encryptionService.decrypt(report.metadata.context as string)
          );
        }
        
        return decrypted;
      });
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
      // Process each metric type separately
      const metricsByType = batch.reduce((acc, metric) => {
        const metricType = metric.metricType || 'unknown';
        if (!acc[metricType]) {
          acc[metricType] = [];
        }
        acc[metricType].push(metric);
        return acc;
      }, {} as Record<string, any[]>);

      // Create metrics for each type
      const createPromises = [];
      
      for (const [metricType, metrics] of Object.entries(metricsByType)) {
        // Process metrics in chunks to avoid too many parameters
        const chunkSize = 100;
        for (let i = 0; i < (metrics as any[]).length; i += chunkSize) {
          const chunk = (metrics as any[]).slice(i, i + chunkSize);
          const createPromise = this.prisma.webRtcMetric.createMany({
            data: chunk.map((m: any) => {
              const metadata: Record<string, any> = {
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
              
              // Add projectId to metadata if it exists
              if (m.projectId) {
                metadata.projectId = m.projectId;
              }

              return {
                id: m.id || undefined, // Let Prisma generate ID if not provided
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

      // Execute all create operations in parallel but don't use transaction
      // as it might not be necessary for metrics collection
      await Promise.all(createPromises);

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
