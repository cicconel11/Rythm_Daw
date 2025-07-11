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
var EventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const uuid_1 = require("uuid");
let EventsService = EventsService_1 = class EventsService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(EventsService_1.name);
        this.BATCH_SIZE = 100;
        this.FLUSH_INTERVAL_MS = 5000;
        this.MAX_BATCH_SIZE = 1000;
        this.eventQueue = [];
        this.flushTimeout = null;
        this.isProcessing = false;
        this.shutdownListener = null;
    }
    onModuleInit() {
        this.scheduleFlush();
    }
    async trackBulk(dto) {
        const { events, debug = false } = dto;
        if (events.length > this.MAX_BATCH_SIZE) {
            throw new Error(`Maximum batch size is ${this.MAX_BATCH_SIZE} events`);
        }
        const validEvents = [];
        for (const event of events) {
            if (!event.userId) {
                this.logger.warn('Skipping event - userId is required');
                continue;
            }
            const trackEvent = {
                ...event,
                userId: event.userId,
                timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
            };
            validEvents.push(trackEvent);
        }
        if (validEvents.length === 0) {
            return;
        }
        if (debug) {
            await this.processEventBatch(validEvents, this.prisma);
            return;
        }
        await this.enqueueEvents(validEvents);
    }
    async processEventBatch(events, tx) {
        if (events.length === 0)
            return;
        try {
            for (const event of events) {
                if (!event.userId) {
                    this.logger.warn('Skipping event - userId is required');
                    continue;
                }
                await this.createActivityLog(tx, event.type, event.userId, event.projectId, event.entityType, event.entityId, event.properties, event.context, event.timestamp);
            }
            this.logger.log(`Processed ${events.length} events synchronously`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error processing events: ${errorMessage}`, errorStack);
            throw error;
        }
    }
    async enqueueEvents(events) {
        if (!events || events.length === 0)
            return;
        this.eventQueue.push(...events);
        if (this.eventQueue.length >= this.BATCH_SIZE) {
            await this.processQueue();
        }
        else if (!this.flushTimeout) {
            this.scheduleFlush();
        }
    }
    async processQueue() {
        if (this.isProcessing || this.eventQueue.length === 0) {
            return;
        }
        this.isProcessing = true;
        const batch = this.eventQueue.splice(0, this.BATCH_SIZE);
        try {
            await this.prisma.$transaction(async (prismaTx) => {
                const tx = prismaTx;
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`Error processing events: ${errorMessage}`, errorStack);
            this.eventQueue.unshift(...batch);
        }
        finally {
            this.isProcessing = false;
            if (this.eventQueue.length > 0) {
                setImmediate(() => this.processQueue());
            }
        }
    }
    async createActivityLog(tx, userId, type, entityType, entityId, projectId, properties = {}, context = {}, timestamp) {
        const metadataObj = {
            ...properties,
            ...(projectId ? { projectId } : {})
        };
        const metadataStr = Object.keys(metadataObj).length > 0
            ? JSON.stringify(metadataObj)
            : '{}';
        const activityData = {
            userId,
            action: type,
            entityType: entityType || 'event',
            entityId: entityId || (0, uuid_1.v4)(),
            metadata: metadataStr,
            ...(timestamp ? { createdAt: new Date(timestamp) } : {}),
            ...(context?.ip && { ipAddress: context.ip }),
            ...(context?.userAgent && { userAgent: context.userAgent }),
            ...(projectId ? { projectId } : {}),
        };
        try {
            return await tx.activityLog.create({
                data: activityData
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to create activity log: ${errorMessage}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    scheduleFlush() {
        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
            this.flushTimeout = null;
        }
        this.flushTimeout = setTimeout(async () => {
            try {
                if (this.eventQueue.length > 0) {
                    await this.processQueue();
                }
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                const errorStack = error instanceof Error ? error.stack : undefined;
                this.logger.error(`Error in scheduled flush: ${errorMessage}`, errorStack);
            }
            finally {
                this.flushTimeout = null;
            }
        }, this.FLUSH_INTERVAL_MS);
    }
    async getEventStats(userId, startDate, endDate) {
        try {
            const total = await this.prisma.activityLog.count({
                where: {
                    userId,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
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
            const byTypeResult = await this.prisma.activityLog.groupBy({
                by: ['action'],
                where: {
                    userId,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _count: true,
            });
            const byType = byTypeResult.reduce((acc, item) => {
                if (item.action) {
                    acc[item.action] = Number(item._count);
                }
                return acc;
            }, {});
            const byUserResult = await this.prisma.$queryRaw `
        SELECT 
          "userId",
          COUNT(*)::bigint as "count"
        FROM "ActivityLog"
        WHERE "userId" IS NOT NULL
          AND "createdAt" >= ${startDate.toISOString()}::timestamptz
          AND "createdAt" <= ${endDate.toISOString()}::timestamptz
        GROUP BY "userId"
      `;
            const byUser = byUserResult.reduce((acc, item) => {
                acc[item.userId] = Number(item.count);
                return acc;
            }, {});
            const byDayResult = await this.prisma.$queryRaw `
        SELECT 
          DATE_TRUNC('day', "createdAt" AT TIME ZONE 'UTC') as "day",
          COUNT(*)::bigint as "count"
        FROM "ActivityLog"
        WHERE "userId" = ${userId}
          AND "createdAt" >= ${startDate.toISOString()}::timestamptz
          AND "createdAt" <= ${endDate.toISOString()}::timestamptz
        GROUP BY DATE_TRUNC('day', "createdAt" AT TIME ZONE 'UTC')
        ORDER BY "day" ASC
      `;
            let byProject = {};
            try {
                const byProjectResult = await this.prisma.$queryRaw `
          SELECT 
            json_extract(metadata, '$.projectId') as "projectId",
            COUNT(*)::bigint as "count"
          FROM "ActivityLog"
          WHERE "userId" = ${userId}
            AND "createdAt" >= ${startDate.toISOString()}::timestamptz
            AND "createdAt" <= ${endDate.toISOString()}::timestamptz
          GROUP BY json_extract(metadata, '$.projectId')
        `;
                byProject = byProjectResult
                    .filter((item) => Boolean(item.projectId))
                    .reduce((acc, item) => {
                    acc[item.projectId] = Number(item.count);
                    return acc;
                }, {});
            }
            catch (error) {
                this.logger.warn('Could not group by project', error);
            }
            return {
                total,
                daysWithEvents: daysWithEvents.length,
                byType,
                byUser,
                byProject,
            };
        }
        catch (error) {
            this.logger.error('Error getting event stats', error);
            throw new Error('Failed to get event stats');
        }
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = EventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], EventsService);
//# sourceMappingURL=events.service.js.map