import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackEventsBulkDto } from './dto/track-event.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaClient } from '@prisma/client';

// Define the ActivityLog type manually since we can't use Prisma generated types
interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: string; // Stored as JSON string
  createdAt: Date;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
}
import type { } from 'node:timers';
import { v4 as uuidv4 } from 'uuid';

// Define a custom type for the Prisma transaction client
type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'> & {
  activityLog: {
    create: (args: { data: Omit<ActivityLog, 'id'> }) => Promise<ActivityLog>;
    groupBy: (args: { 
      by: string[]; 
      where?: Record<string, any>;
      _count?: boolean;
    }) => Promise<Array<{ action: string; _count: number }>>;
    findMany: (args?: { where?: Record<string, any> }) => Promise<ActivityLog[]>;
    count: (args?: { where?: Record<string, any> }) => Promise<number>;
  };
  $queryRaw: <T = any>(query: TemplateStringsArray, ...values: any[]) => Promise<T[]>;
  $executeRaw: (query: TemplateStringsArray, ...values: any[]) => Promise<number>;
};

interface EventStats {
  total: number;
  daysWithEvents: number;
  byType: Record<string, number>;
  byUser: Record<string, number>;
  byProject: Record<string, number>;
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
type EventDto = {
  type: string;
  userId?: string;
  timestamp?: string | Date;
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

    // Process events and filter out invalid ones
    const validEvents: TrackEvent[] = [];
    
    for (const event of events) {
      if (!event.userId) {
        this.logger.warn('Skipping event - userId is required');
        continue;
      }
      
      const trackEvent: TrackEvent = {
        ...event,
        userId: event.userId, // This is now guaranteed to exist
        timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
      };
      
      validEvents.push(trackEvent);
    }

    if (validEvents.length === 0) {
      return;
    }

    // Process events immediately if in debug mode
    if (debug) {
      await this.processEventBatch(validEvents, this.prisma as unknown as TransactionClient);
      return;
    }

    // Otherwise, enqueue for batch processing
    await this.enqueueEvents(validEvents);
  }

  /**
   * Process events immediately (synchronously)
   * @param events Array of events to process
   */
  private async processEventBatch(events: TrackEvent[], tx: TransactionClient): Promise<void> {
    if (events.length === 0) return;

    try {
      await tx.$transaction(async (prismaTx: any) => {
        const txClient = prismaTx as TransactionClient;
        for (const event of events) {
          if (!event.userId) {
            this.logger.warn('Skipping event - userId is required');
            continue;
          }
          await this.createActivityLog(txClient, event.type, event.userId, event.projectId, event.entityType, event.entityId, event.properties, event.context, event.timestamp);
          await this.createActivityLog(tx, event.type, event.userId, event.projectId, event.entityType, event.entityId, event.properties, event.context, event.timestamp);
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
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const batch = this.eventQueue.splice(0, this.BATCH_SIZE);

    try {
      await (this.prisma as any).$transaction(async (prismaTx: any) => {
        const tx = prismaTx as unknown as TransactionClient;
        for (const event of batch) {
          if (!event.userId) {
            this.logger.warn('Skipping event - userId is required');
            continue;
          }
          await this.createActivityLog(tx, event.type, event.userId, event.projectId, event.entityType, event.entityId, event.properties, event.context, event.timestamp);
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
   * Create an activity log entry from a track event
   */
  private async createActivityLog(
    tx: TransactionClient,
    type: string,
    userId: string,
    projectId?: string,
    entityType?: string,
    entityId?: string,
    properties: Record<string, any> = {},
    context: EventContext = {},
    timestamp?: string | Date
  ): Promise<ActivityLog> {
    const metadata = JSON.stringify({
      ...properties,
      ...(projectId ? { projectId } : {})
    });

    const activityData = {
      userId,
      action: type,
      entityType: entityType || 'event',
      entityId: entityId || uuidv4(),
      metadata,
      createdAt: timestamp ? new Date(timestamp) : new Date(),
      ...(context?.ip && { ipAddress: context.ip }),
      ...(context?.userAgent && { userAgent: context.userAgent }),
    };

    try {
      return await tx.activityLog.create({ 
        data: activityData 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create activity log: ${errorMessage}`, error instanceof Error ? error.stack : undefined);
      throw error;
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
   * @param userId User ID to filter events by
   * @param startDate Start date to filter events by
   * @param endDate End date to filter events by
   */
  async getEventStats(userId: string, startDate: Date, endDate: Date): Promise<EventStats> {
    try {
      // Get total count of events
      const total = await this.prisma.activityLog.count({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // Get unique days with events
      const daysWithEvents = await this.prisma.activityLog.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          createdAt: true,
        },
        distinct: ['createdAt'],
      });

      // Get counts by action type using raw query with type assertion
      type ByTypeResult = Array<{ action: string; count: bigint }>;
      const prismaClient = this.prisma as unknown as {
        $queryRaw: (query: TemplateStringsArray, ...values: any[]) => Promise<ByTypeResult>;
      };
      
      const byTypeResult = await prismaClient.$queryRaw`
        SELECT action, COUNT(*) as count
        FROM "ActivityLog"
        WHERE "userId" = ${userId}
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${endDate}
        GROUP BY action
      `;

      type ByTypeItem = { action: string; count: bigint };
      const byType = byTypeResult.reduce((acc: Record<string, number>, item: ByTypeItem) => {
        acc[item.action] = Number(item.count);
        return acc;
      }, {});

      // Get counts by user (if applicable)
      const byUserResult = await this.prisma.activityLog.groupBy({
        by: ['userId'],
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: true,
      });

      const byUser = byUserResult.reduce<Record<string, number>>((acc: Record<string, number>, item: { userId: string; _count: number }) => {
        acc[item.userId] = item._count;
        return acc;
      }, {});

      // Get counts by project (if projectId exists in the metadata)
      let byProject: Record<string, number> = {};
      
      try {
        type ByProjectResult = Array<{ projectId: string | null; count: bigint }>;
        const prismaProjectClient = this.prisma as unknown as {
          $queryRaw: (query: TemplateStringsArray, ...values: any[]) => Promise<ByProjectResult>;
        };
        
        const byProjectResult = await prismaProjectClient.$queryRaw`
          SELECT 
            json_extract(metadata, '$.projectId') as projectId,
            COUNT(*) as count
          FROM "ActivityLog"
          WHERE "userId" = ${userId}
            AND "createdAt" >= ${startDate}
            AND "createdAt" <= ${endDate}
            AND json_extract(metadata, '$.projectId') IS NOT NULL
          GROUP BY json_extract(metadata, '$.projectId')
        `;

        byProject = byProjectResult
          .filter((item: { projectId: string | null }): item is { projectId: string; count: bigint } => Boolean(item.projectId))
          .reduce<Record<string, number>>((acc: Record<string, number>, item: { projectId: string; count: bigint }) => {
            acc[item.projectId] = Number(item.count);
            return acc;
          }, {});
      } catch (error) {
        // Project grouping is optional if metadata.projectId doesn't exist
        this.logger.warn('Could not group by project', error);
      }

      return {
        total,
        daysWithEvents: daysWithEvents.length,
        byType,
        byUser,
        byProject,
      };
    } catch (error) {
      this.logger.error('Error getting event stats', error);
      throw new Error('Failed to get event stats');
    }
  }
}
