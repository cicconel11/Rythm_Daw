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
const client_1 = require("@prisma/client");
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
        const validEvents = events.filter(event => {
            if (!event.userId) {
                this.logger.warn('Skipping event - userId is required');
                return false;
            }
            return true;
        });
        const trackEvents = validEvents.map((event) => {
            const trackEvent = {
                type: event.type,
                userId: event.userId,
                timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
            };
            const assignIfExists = (key, value) => {
                if (value !== undefined) {
                    trackEvent[key] = value;
                }
            };
            assignIfExists('properties', event.properties);
            assignIfExists('context', event.context);
            assignIfExists('entityType', event.entityType);
            assignIfExists('entityId', event.entityId);
            assignIfExists('name', event.name);
            assignIfExists('anonymousId', event.anonymousId);
            assignIfExists('sessionId', event.sessionId);
            assignIfExists('projectId', event.projectId);
            return trackEvent;
        });
        if (debug) {
            this.logger.debug(`Processing ${trackEvents.length} events in debug mode`);
            await this.processEvents(trackEvents);
        }
        else {
            await this.enqueueEvents(trackEvents);
        }
    }
    async processEvents(events) {
        if (events.length === 0)
            return;
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
    async createActivityLog(event, tx) {
        const { userId, type, properties = {}, context = {}, timestamp, projectId, entityType, entityId } = event;
        const activityData = {
            action: type,
            entityType: entityType || 'event',
            entityId: entityId || (0, uuid_1.v4)(),
            metadata: {
                ...properties,
                ...(projectId ? { projectId } : {})
            },
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to create activity log: ${errorMessage}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
    async processQueue() {
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
    async getStats(options = {}) {
        const { startDate, endDate, userId, action } = options;
        const where = {
            AND: [
                startDate ? { createdAt: { gte: startDate } } : {},
                endDate ? { createdAt: { lte: endDate } } : {},
                userId ? { userId } : {},
                action ? { action } : {},
            ].filter(Boolean),
        };
        const stats = {
            total: 0,
            byType: {},
            byDay: [],
            byUser: {},
            byProject: {}
        };
        try {
            stats.total = await this.prisma.activityLog.count({ where });
            const byTypeResults = await this.prisma.activityLog.groupBy({
                by: ['action'],
                where,
                _count: true,
            });
            stats.byType = byTypeResults.reduce((acc, { action, _count }) => {
                if (action) {
                    acc[action] = _count;
                }
                return acc;
            }, {});
            const byDay = await this.prisma.$queryRaw `
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM "ActivityLog"
        WHERE ${client_1.Prisma.raw(JSON.stringify(where))}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `;
            stats.byDay = byDay.map(({ date, count }) => ({
                date,
                count: Number(count)
            }));
            const byUserResults = await this.prisma.activityLog.groupBy({
                by: ['userId'],
                where,
                _count: true,
            });
            stats.byUser = byUserResults.reduce((acc, { userId, _count }) => {
                if (userId) {
                    acc[userId] = _count;
                }
                return acc;
            }, {});
            try {
                const byProjectResults = await this.prisma.$queryRaw `
          SELECT 
            metadata->>'projectId' as "projectId", 
            COUNT(*)::int as count
          FROM "ActivityLog"
          WHERE ${client_1.Prisma.raw(JSON.stringify(where))}
          AND metadata->>'projectId' IS NOT NULL
          GROUP BY metadata->>'projectId'
        `;
                stats.byProject = byProjectResults.reduce((acc, { projectId, count }) => {
                    if (projectId) {
                        acc[projectId] = Number(count);
                    }
                    return acc;
                }, {});
            }
            catch (error) {
                this.logger.debug('Project grouping not available in ActivityLog metadata');
            }
            return stats;
        }
        catch (error) {
            this.logger.error(`Error getting event stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
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