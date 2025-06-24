import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TrackEventsBulkDto } from './dto/track-event.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event } from '@prisma/client';

@Injectable()
export class EventsService implements OnModuleInit {
  private readonly logger = new Logger(EventsService.name);
  private readonly MAX_BATCH_SIZE = 50;
  private readonly BATCH_FLUSH_INTERVAL = 5000; // 5 seconds
  private readonly MAX_QUEUE_SIZE = 1000;
  private queue: Event[] = [];
  private flushTimer: NodeJS.Timeout;

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    // Start the batch processing timer
    this.scheduleFlush();
  }

  /**
   * Track multiple events in bulk
   * @param dto TrackEventsBulkDto containing events to track
   */
  async trackBulk(dto: TrackEventsBulkDto) {
    const { events, debug = false } = dto;

    // Validate batch size
    if (events.length > this.MAX_BATCH_SIZE) {
      throw new Error(`Maximum batch size is ${this.MAX_BATCH_SIZE} events`);
    }

    // Process each event
    const now = new Date();
    const dbEvents = events.map((event) => {
      const timestamp = event.timestamp ? new Date(event.timestamp) : now;
      const context = event.context || {};

      const dbEvent: Omit<Event, 'id' | 'receivedAt'> = {
        eventType: event.type,
        name: event.name || null,
        userId: event.userId || null,
        anonymousId: event.anonymousId || null,
        sessionId: event.sessionId || null,
        projectId: event.projectId || null,
        
        // Context
        ipAddress: context.ip || null,
        userAgent: context.userAgent || null,
        url: context.url || null,
        path: context.path || null,
        referrer: context.referrer || null,
        
        // Device info
        osName: context.osName || null,
        osVersion: context.osVersion || null,
        browserName: context.browserName || null,
        browserVersion: context.browserVersion || null,
        deviceType: context.deviceType || null,
        
        // Location
        country: context.country || null,
        region: context.region || null,
        city: context.city || null,
        
        // Event data
        properties: event.properties || {},
        
        // Timestamps
        eventTime: timestamp,
        createdAt: timestamp,
      };

      return dbEvent;
    });

    // Add to queue
    this.enqueueEvents(dbEvents);

    // Emit events for real-time processing
    if (debug) {
      this.logger.debug(`Processing ${dbEvents.length} events in debug mode`);
      await this.processEvents(dbEvents);
    } else {
      this.eventEmitter.emit('analytics.events.received', dbEvents);
    }
  }

  /**
   * Enqueue events for batch processing
   */
  private enqueueEvents(events: Omit<Event, 'id' | 'receivedAt'>[]) {
    // Check queue size limit
    if (this.queue.length + events.length > this.MAX_QUEUE_SIZE) {
      this.logger.warn(`Event queue full (${this.queue.length}), forcing flush`);
      this.flushQueue();
    }

    this.queue.push(...events);
    
    // Auto-flush if queue reaches half the batch size
    if (this.queue.length >= this.MAX_BATCH_SIZE / 2) {
      this.flushQueue();
    }
  }

  /**
   * Process events in the queue
   */
  private async processEvents(events: Omit<Event, 'id' | 'receivedAt'>[]) {
    if (events.length === 0) return;

    try {
      await this.prisma.$transaction(async (tx) => {
        // Insert events in batches
        const batchSize = 100;
        for (let i = 0; i < events.length; i += batchSize) {
          const batch = events.slice(i, i + batchSize);
          await tx.event.createMany({
            data: batch,
            skipDuplicates: true,
          });
        }
      });

      this.logger.log(`Processed ${events.length} analytics events`);
    } catch (error) {
      this.logger.error(`Failed to process events: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Flush the current queue
   */
  private async flushQueue() {
    if (this.queue.length === 0) return;
    
    const eventsToProcess = [...this.queue];
    this.queue = [];
    
    try {
      await this.processEvents(eventsToProcess);
    } catch (error) {
      // Requeue failed events with backoff
      this.queue.unshift(...eventsToProcess);
      this.logger.warn(`Requeued ${eventsToProcess.length} failed events`);
    }
  }

  /**
   * Schedule the next queue flush
   */
  private scheduleFlush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    
    this.flushTimer = setTimeout(async () => {
      await this.flushQueue();
      this.scheduleFlush();
    }, this.BATCH_FLUSH_INTERVAL);
    
    // Don't prevent Node.js from exiting
    this.flushTimer.unref();
  }

  /**
   * Get event statistics
   */
  async getStats(options: { 
    startDate: Date; 
    endDate: Date; 
    eventType?: string;
    projectId?: string;
  }) {
    const { startDate, endDate, eventType, projectId } = options;
    
    const where: any = {
      eventTime: {
        gte: startDate,
        lte: endDate,
      },
    };
    
    if (eventType) where.eventType = eventType;
    if (projectId) where.projectId = projectId;
    
    const [total, byType] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.groupBy({
        by: ['eventType'],
        where,
        _count: { _all: true },
        orderBy: { _count: { eventType: 'desc' } },
      }),
    ]);
    
    return {
      total,
      byType: byType.map((item) => ({
        eventType: item.eventType,
        count: item._count._all,
      })),
    };
  }
}
