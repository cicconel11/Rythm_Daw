import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebRtcMetricDto, MetricCategory } from './dto/webrtc-metric.dto';
import { CrashReportDto } from './dto/crash-report.dto';

interface WebRtcMetricRecord {
  userId: string;
  projectId?: string | null;
  category: MetricCategory;
  value: number;
  peerConnectionId?: string | null;
  rttMs?: number | null;
  jitterMs?: number | null;
  packetLoss?: number | null;
  networkType?: string | null;
  effectiveType?: string | null;
  downlinkMbps?: number | null;
  iceCandidatePairId?: string | null;
  localCandidateId?: string | null;
  remoteCandidateId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

@Injectable()
export class QosService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QosService.name);
  private webRtcMetricsQueue: WebRtcMetricRecord[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 100;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Initialize the service
   */
  onModuleInit(): void {
    this.logger.log('QoS Service initialized');
    // Start the batch processing timer
    this.scheduleFlush();
  }

  /**
   * Clean up resources when the module is destroyed
   */
  async onModuleDestroy(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Flush any remaining metrics before shutting down
    if (this.webRtcMetricsQueue.length > 0) {
      try {
        await this.flushWebRtcMetrics();
      } catch (error) {
        this.logger.error('Error during final flush on shutdown:', error);
      }
    }
  }

  /**
   * Schedule the next batch flush
   */
  private scheduleFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }

    this.flushTimer = setTimeout(async () => {
      try {
        await this.flushWebRtcMetrics();
      } catch (error) {
        this.logger.error('Error during scheduled flush:', error);
      } finally {
        // Only schedule next flush if there are more items in the queue
        if (this.webRtcMetricsQueue.length > 0) {
          this.scheduleFlush();
        } else {
          this.flushTimer = null;
        }
      }
    }, this.FLUSH_INTERVAL);

    // Don't keep the Node.js process alive just for this timer
    if (this.flushTimer) {
      this.flushTimer.unref();
    }
  }

  /**
   * Records WebRTC metrics
   */
  async recordWebRtcMetrics(metric: WebRtcMetricDto): Promise<void> {
    try {
      // Create a well-typed metric record
      const metricRecord: WebRtcMetricRecord = {
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

      // Add to batch queue for processing
      this.webRtcMetricsQueue.push(metricRecord);

      // Process immediately if batch size is reached
      if (this.webRtcMetricsQueue.length >= this.BATCH_SIZE) {
        await this.flushWebRtcMetrics();
      } else if (!this.flushTimer) {
        this.scheduleFlush();
      }
    } catch (error) {
      this.logger.error('Error recording WebRTC metric:', error);
      throw error;
    }
  }

  /**
   * Flush queued WebRTC metrics to the database
   */
  private async flushWebRtcMetrics(): Promise<void> {
    if (this.webRtcMetricsQueue.length === 0) {
      return;
    }

    // Take a batch of metrics from the queue
    const batch = this.webRtcMetricsQueue.splice(0, this.BATCH_SIZE);
    
    try {
      // Prepare records for batch insert
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

      // Insert records in a transaction
      await this.prisma.$transaction([
        this.prisma.webRtcMetric.createMany({
          data: records
        })
      ]);

      this.logger.debug(`Successfully flushed ${records.length} WebRTC metrics`);
    } catch (error) {
      // Re-queue the batch if there was an error
      this.webRtcMetricsQueue.unshift(...batch);
      this.logger.error('Error flushing WebRTC metrics:', error);
      throw error;
    }
  }

  /**
   * Records a crash report with stack trace and context
   */
  async recordCrashReport(report: CrashReportDto, userId?: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required for crash reports');
    }

    try {
      const data = {
        error: report.message || report.name || 'Unknown error',
        stackTrace: report.stack || 'No stack trace available',
        stack: report.stack || null,
        breadcrumbs: report.breadcrumbs ? JSON.stringify(report.breadcrumbs) : null,
        context: report.context ? JSON.stringify(report.context) : null,
        userId: userId || 'anonymous',
        projectId: report.projectId || null,
        metadata: JSON.stringify({
          type: report.type || 'unknown',
          name: report.name,
          message: report.message,
          platform: report.platform,
          os: report.os,
          browser: report.browser,
          userAgent: report.userAgent,
          url: report.url,
          memoryUsage: report.memoryUsage,
          ...report.context
        })
      };

      await this.prisma.crashReport.create({ data });
      this.logger.log(`Crash report recorded for user ${userId || 'anonymous'}`);
    } catch (error) {
      this.logger.error('Error recording crash report:', error);
      throw error;
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
    category?: string;
  }): Promise<Array<Record<string, unknown>>> {
    const { userId, projectId, startDate, endDate, limit = 1000, category } = options;

    const where: Record<string, unknown> = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;
    if (category) where.metricType = category;

    try {
      return await this.prisma.webRtcMetric.findMany({
        where,
        take: limit,
        orderBy: { timestamp: 'desc' },
      });
    } catch (error) {
      this.logger.error('Error fetching WebRTC metrics:', error);
      throw error;
    }
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
  }): Promise<Array<Record<string, unknown>>> {
    const { userId, projectId, startDate, endDate, type, limit = 100, includeSensitive = false } = options;

    const where: Record<string, unknown> = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;
    if (type) where.type = type;

    try {
      const reports = await this.prisma.crashReport.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      return reports.map((report: Record<string, unknown>) => {
        const result: Record<string, unknown> = {
          id: report.id,
          error: report.error,
          stack: includeSensitive ? report.stack : (report.stack ? '[REDACTED]' : null),
          stackTrace: includeSensitive ? report.stackTrace : (report.stackTrace ? '[REDACTED]' : null),
          userId: report.userId,
          projectId: report.projectId,
          createdAt: report.createdAt,
          type: report.type || null,
        };

        // Handle potentially sensitive data
        if (includeSensitive) {
          // Handle breadcrumbs
          if (report.breadcrumbs) {
            try {
              result.breadcrumbs = typeof report.breadcrumbs === 'string' 
                ? JSON.parse(report.breadcrumbs) 
                : report.breadcrumbs;
            } catch (e) {
              result.breadcrumbs = null;
              this.logger.warn('Failed to parse breadcrumbs', { reportId: report.id });
            }
          } else {
            result.breadcrumbs = null;
          }

          // Handle context
          if (report.context) {
            try {
              result.context = typeof report.context === 'string' 
                ? JSON.parse(report.context) 
                : report.context;
            } catch (e) {
              result.context = null;
              this.logger.warn('Failed to parse context', { reportId: report.id });
            }
          } else {
            result.context = null;
          }

          // Handle metadata
          if (report.metadata) {
            try {
              const metadata = typeof report.metadata === 'string' 
                ? JSON.parse(report.metadata) 
                : report.metadata;
              
              result.metadata = metadata;
              
              // Extract common fields
              if (metadata && typeof metadata === 'object') {
                result.platform = metadata.platform || null;
                result.os = metadata.os || null;
                result.browser = metadata.browser || null;
                result.userAgent = metadata.userAgent || null;
                result.url = metadata.url || null;
                result.memoryUsage = metadata.memoryUsage || null;
              }
            } catch (e) {
              result.metadata = null;
              this.logger.warn('Failed to parse metadata', { reportId: report.id });
            }
          } else {
            result.metadata = null;
          }
        } else {
          // Redact sensitive data
          result.breadcrumbs = report.breadcrumbs ? '[REDACTED]' : null;
          result.context = report.context ? '[REDACTED]' : null;
          result.metadata = report.metadata ? '[REDACTED]' : null;
        }

        return result;
      });
    } catch (error) {
      this.logger.error('Error fetching crash reports:', error);
      throw error;
    }
  }
}
