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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let EventsService = EventsService_1 = class EventsService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(EventsService_1.name);
        this.MAX_BATCH_SIZE = 50;
        this.BATCH_FLUSH_INTERVAL = 5000;
        this.MAX_QUEUE_SIZE = 1000;
        this.queue = [];
    }
    onModuleInit() {
        this.scheduleFlush();
    }
    async trackBulk(dto) {
        const { events, debug = false } = dto;
        if (events.length > this.MAX_BATCH_SIZE) {
            throw new Error(`Maximum batch size is ${this.MAX_BATCH_SIZE} events`);
        }
        const now = new Date();
        const dbEvents = events.map((event) => {
            const timestamp = event.timestamp ? new Date(event.timestamp) : now;
            const context = event.context || {};
            const dbEvent = {
                eventType: event.type,
                name: event.name || null,
                userId: event.userId || null,
                anonymousId: event.anonymousId || null,
                sessionId: event.sessionId || null,
                projectId: event.projectId || null,
                ipAddress: context.ip || null,
                userAgent: context.userAgent || null,
                url: context.url || null,
                path: context.path || null,
                referrer: context.referrer || null,
                osName: context.osName || null,
                osVersion: context.osVersion || null,
                browserName: context.browserName || null,
                browserVersion: context.browserVersion || null,
                deviceType: context.deviceType || null,
                country: context.country || null,
                region: context.region || null,
                city: context.city || null,
                properties: event.properties || {},
                eventTime: timestamp,
                createdAt: timestamp,
            };
            return dbEvent;
        });
        this.enqueueEvents(dbEvents);
        if (debug) {
            this.logger.debug(`Processing ${dbEvents.length} events in debug mode`);
            await this.processEvents(dbEvents);
        }
        else {
            this.eventEmitter.emit('analytics.events.received', dbEvents);
        }
    }
    enqueueEvents(events) {
        if (this.queue.length + events.length > this.MAX_QUEUE_SIZE) {
            this.logger.warn(`Event queue full (${this.queue.length}), forcing flush`);
            this.flushQueue();
        }
        this.queue.push(...events);
        if (this.queue.length >= this.MAX_BATCH_SIZE / 2) {
            this.flushQueue();
        }
    }
    async processEvents(events) {
        if (events.length === 0)
            return;
        try {
            await this.prisma.$transaction(async (tx) => {
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
        }
        catch (error) {
            this.logger.error(`Failed to process events: ${error.message}`, error.stack);
            throw error;
        }
    }
    async flushQueue() {
        if (this.queue.length === 0)
            return;
        const eventsToProcess = [...this.queue];
        this.queue = [];
        try {
            await this.processEvents(eventsToProcess);
        }
        catch (error) {
            this.queue.unshift(...eventsToProcess);
            this.logger.warn(`Requeued ${eventsToProcess.length} failed events`);
        }
    }
    scheduleFlush() {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
        }
        this.flushTimer = setTimeout(async () => {
            await this.flushQueue();
            this.scheduleFlush();
        }, this.BATCH_FLUSH_INTERVAL);
        this.flushTimer.unref();
    }
    async getStats(options) {
        const { startDate, endDate, eventType, projectId } = options;
        const where = {
            eventTime: {
                gte: startDate,
                lte: endDate,
            },
        };
        if (eventType)
            where.eventType = eventType;
        if (projectId)
            where.projectId = projectId;
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
};
EventsService = EventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _b : Object])
], EventsService);
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map