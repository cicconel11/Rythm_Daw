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
var ActivityLoggerService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLoggerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const event_emitter_1 = require("@nestjs/event-emitter");
let ActivityLoggerService = ActivityLoggerService_1 = class ActivityLoggerService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(ActivityLoggerService_1.name);
    }
    onModuleInit() {
        this.logger.log('Activity Logger Service initialized');
    }
    async logActivity(data) {
        try {
            const { projectId, userId, event, payload, ipAddress, userAgent } = data;
            const activity = await this.prisma.activityLog.create({
                data: {
                    event,
                    payload: payload || {},
                    ipAddress,
                    userAgent,
                    project: projectId ? { connect: { id: projectId } } : undefined,
                    user: userId ? { connect: { id: userId } } : undefined,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            });
            const room = projectId ? `project:${projectId}` : `user:${userId}`;
            const eventData = {
                ...activity,
                user: activity.user,
                projectId: activity.projectId,
                userId: activity.userId
            };
            this.server.to(room).emit('activity', eventData);
            this.server.emit('activity', eventData);
            this.eventEmitter.emit('activity.created', eventData);
            this.logger.debug(`Activity logged: ${event} for project ${projectId} by user ${userId}`);
            return activity;
        }
        catch (error) {
            this.logger.error(`Failed to log activity: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getActivities(options) {
        const { projectId, userId, event, limit = 50, cursor } = options;
        return this.prisma.activityLog.findMany({
            where: {
                projectId,
                userId,
                event,
                id: cursor ? { lt: cursor } : undefined,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getActivitySummary(projectId, days = 7) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.prisma.$queryRaw `
      SELECT 
        DATE("createdAt") as date,
        "event",
        COUNT(*) as count
      FROM "ActivityLog"
      WHERE "projectId" = ${projectId}
        AND "createdAt" >= ${date}
      GROUP BY DATE("createdAt"), "event"
      ORDER BY date DESC, count DESC;
    `;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ActivityLoggerService.prototype, "server", void 0);
ActivityLoggerService = ActivityLoggerService_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({ namespace: 'activity' }),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _b : Object])
], ActivityLoggerService);
exports.ActivityLoggerService = ActivityLoggerService;
//# sourceMappingURL=activity-logger.service.js.map