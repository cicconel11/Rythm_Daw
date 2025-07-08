import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackEventsBulkDto } from './dto/track-event.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma, ActivityLog, PrismaClient } from '@prisma/client';
import type { } from 'node:timers';
import { v4 as uuidv4 } from 'uuid';

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

interface EventStats {
  total: number;
  byType: Record<string, number>;
  byDay: Array<{ date: string; count: number }>;
  byProject: Record<string, number>;
  byUser: Record<string, number>;
}

interface EventContext {
  ip?: string;
  userAgent?: string;
  url?: string;
  path?: string;
  referrer?: string;
  osName?: string;
  osVersion?: string;
  browserName?: string;
  browserVersion?: string;
  deviceType?: string;
  country?: string;
  region?: string;
  city?: string;
}

interface TrackEvent {
  id?: string;
  type: string;
  userId: string; // Required field
  projectId?: string;
  timestamp?: Date | string;
  context?: EventContext;
  properties?: Record<string, any>;
  entityType?: string;
  entityId?: string;
  name?: string;
  anonymousId?: string;
  sessionId?: string;
  [key: string]: any; // Allow additional properties
}

// EventDto should match the TrackEvent interface but with timestamp as string | Date
type EventDto = Omit<TrackEvent, 'timestamp'> & {
  timestamp?: string | Date;
  // Explicitly include all optional fields to ensure they're in the type system
  projectId?: string;
  context?: EventContext;
  properties?: Record<string, any>;
  entityType?: string;
  entityId?: string;
  name?: string;
  anonymousId?: string;
  sessionId?: string;
};

@Injectable()
export class EventsService implements OnModuleInit {
  private readonly logger = new Logger(EventsService.name);
  private readonly BATCH_SIZE = 100;
  private readonly FLUSH_INTERVAL_MS = 5000;
  private readonly MAX_BATCH_SIZE = 1000;
  
  private eventQueue: TrackEvent[] = [];
  private flushTimeout: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private shutdownListener: (() => void) | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    this.scheduleFlush();
  }

  /**
   * Track multiple events in bulk
   * @param dto TrackEventsBulkDto containing events to track
   */
  async trackBulk(dto: TrackEventsBulkDto): Promise<void> {
    const { events, debug = false } = dto;

    // Validate batch size
    if (events.length > this.MAX_BATCH_SIZE) {
      throw new Error(`Maximum batch size is ${this.MAX_BATCH_SIZE} events`);
    }

    // Filter out events without required userId
    const validEvents = events.filter(event => {
      if (!event.userId) {
        this.logger.warn('Skipping event - userId is required');
        return false;
      }
      return true;
    });

    // Map events to TrackEvent type with proper typing and required fields
    const trackEvents: TrackEvent[] = validEvents.map((event) => {
      // Create a new object with type assertion to handle the dynamic fields
      const trackEvent: TrackEvent = {
        type: event.type,
        userId: event.userId, // Required field
        timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
      } as TrackEvent;

      // Helper function to safely assign optional fields
      const assignIfExists = <K extends keyof TrackEvent>(key: K, value: any) => {
        if (value !== undefined) {
          (trackEvent as any)[key] = value;
        }
      };

      // Assign optional fields if they exist
      assignIfExists('properties', event.properties);
      assignIfExists('context', event.context);
      assignIfExists('entityType', (event as any).entityType);
      assignIfExists('entityId', (event as any).entityId);
      assignIfExists('name', event.name);
      assignIfExists('anonymousId', event.anonymousId);
      assignIfExists('sessionId', event.sessionId);
      assignIfExists('projectId', event.projectId);

      return trackEvent;
    });

    if (debug) {
      this.logger.debug(`Processing ${trackEvents.length} events in debug mode`);
      await this.processEvents(trackEvents);
    } else {
      await this.enqueueEvents(trackEvents);
    }
  }

  /**
   * Process events immediately (synchronously)
   * @param events Array of events to process
   */
  private async processEvents(events: TrackEvent[]): Promise<void> {
    if (events.length === 0) return;

    try {
      await this.prisma.$transaction(async (tx) => {
        for (const event of events) {
          if (!event.userId) {
            this.logger.warn('Skipping event - userId is required');
            continue;
          }
          await this.createActivityLog(event, tx);
        }
      });
      this.logger.log(`Processed ${events.length} events synchronously`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error processing events: ${errorMessage}`, errorStack);
      throw error;
    }
  }

  /**
   * Enqueue events for batch processing
   */
  private async enqueueEvents(events: TrackEvent[]): Promise<void> {
    if (!events || events.length === 0) return;
    
    this.eventQueue.push(...events);
    
    // Process immediately if we've reached batch size
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      await this.processQueue();
    } else if (!this.flushTimeout) {
      // Otherwise schedule a flush if one isn't already scheduled
      this.scheduleFlush();
    }
  }

  /**
   * Process events in the queue
   */
  /**
   * Create an activity log entry from a track event
   */
  private async createActivityLog(event: TrackEvent, tx: TransactionClient): Promise<void> {
    const { userId, type, properties = {}, context = {}, timestamp, projectId, entityType, entityId } = event;
    
    // Prepare the activity log data with proper typing
    const activityData: Prisma.ActivityLogCreateInput = {
      action: type,
      entityType: entityType || 'event',
      entityId: entityId || uuidv4(),
      metadata: {
        ...properties,
        ...(projectId ? { projectId } : {})
      } as Prisma.InputJsonValue,
      createdAt: timestamp ? new Date(timestamp) : new Date(),
      user: { 
        connect: { 
          id: userId 
        } 
      },
      ...(context?.ip && { ipAddress: context.ip }),
      ...(context?.userAgent && { userAgent: context.userAgent }),
    };

    try {
      await tx.activityLog.create({ 
        data: activityData 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create activity log: ${errorMessage}`, error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const batch = this.eventQueue.splice(0, this.BATCH_SIZE);

    try {
      await this.prisma.$transaction(async (tx) => {
        for (const event of batch) {
          if (!event.userId) {
            this.logger.warn('Skipping event - userId is required');
            continue;
          }
          
          await this.createActivityLog(event, tx);
        }
      });

      this.logger.log(`Processed ${batch.length} events`);
      this.eventEmitter.emit('events.processed', { count: batch.length });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error processing events: ${errorMessage}`, errorStack);
      // Requeue the failed batch
      this.eventQueue.unshift(...batch);
    } finally {
      this.isProcessing = false;
      
      // Process next batch if there are more events
      if (this.eventQueue.length > 0) {
        setImmediate(() => this.processQueue());
      }
    }
  }

  /**
   * Schedule the next queue flush
   */
  private scheduleFlush(): void {
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    this.flushTimeout = setTimeout(async () => {
      try {
        if (this.eventQueue.length > 0) {
          await this.processQueue();
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : undefined;
        this.logger.error(`Error in scheduled flush: ${errorMessage}`, errorStack);
      } finally {
        this.flushTimeout = null;
      }
    }, this.FLUSH_INTERVAL_MS);
  }

  /**
   * Get event statistics
   * @param options Filtering options for the statistics
   */
  async getStats(options: { 
    startDate?: Date; 
    endDate?: Date; 
    userId?: string;
    action?: string;
  } = {}): Promise<EventStats> {
    const { startDate, endDate, userId, action } = options;
    
    // Build the where clause for filtering
    const where: Prisma.ActivityLogWhereInput = {
      AND: [
        startDate ? { createdAt: { gte: startDate } } : {},
        endDate ? { createdAt: { lte: endDate } } : {},
        userId ? { userId } : {},
        action ? { action } : {},
      ].filter(Boolean) as Prisma.ActivityLogWhereInput[],
    };

    // Initialize stats with default values
    const stats: EventStats = {
      total: 0,
      byType: {},
      byDay: [],
      byUser: {},
      byProject: {}
    };
    
    try {
      // Get total count
      stats.total = await this.prisma.activityLog.count({ where });

      // Group by event type
      const byTypeResults = await this.prisma.activityLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      });
      
      stats.byType = byTypeResults.reduce<Record<string, number>>((acc, { action, _count }) => {
        if (action) {
          acc[action] = _count as number;
        }
        return acc;
      }, {});

      // Get counts by day
      const byDay = await this.prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM "ActivityLog"
        WHERE ${Prisma.raw(JSON.stringify(where))}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `;
      
      stats.byDay = byDay.map(({ date, count }) => ({
        date,
        count: Number(count)
      }));

      // Group by user
      const byUserResults = await this.prisma.activityLog.groupBy({
        by: ['userId'],
        where,
        _count: true,
      });
      
      stats.byUser = byUserResults.reduce<Record<string, number>>((acc, { userId, _count }) => {
        if (userId) {
          acc[userId] = _count as number;
        }
        return acc;
      }, {});

      // Get counts by project (if projectId exists in the metadata)
      try {
        // Since projectId is not a direct field, we'll use a raw query to group by metadata->>'projectId'
        const byProjectResults = await this.prisma.$queryRaw<Array<{ projectId: string; count: bigint }>>`
          SELECT 
            metadata->>'projectId' as "projectId", 
            COUNT(*)::int as count
          FROM "ActivityLog"
          WHERE ${Prisma.raw(JSON.stringify(where))}
          AND metadata->>'projectId' IS NOT NULL
          GROUP BY metadata->>'projectId'
        `;
        
        stats.byProject = byProjectResults.reduce<Record<string, number>>((acc, { projectId, count }) => {
          if (projectId) {
            acc[projectId] = Number(count);
          }
          return acc;
        }, {});
      } catch (error) {
        // Project grouping is optional if metadata.projectId doesn't exist
        this.logger.debug('Project grouping not available in ActivityLog metadata');
      }
      
      return stats;
      
    } catch (error) {
      this.logger.error(`Error getting event stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}
