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
        const { action, entityId = '', entityType = 'system', userId, projectId, metadata = {}, ipAddress, userAgent } = data;
        try {
            const activityData = {
                action,
                entityId,
                entityType,
                metadata: metadata,
                ...(ipAddress && { ipAddress }),
                ...(userAgent && { userAgent }),
                ...(userId && { userId }),
                ...(projectId && { projectId }),
            };
            const query = `
        INSERT INTO "ActivityLog" (${Object.keys(activityData).join(', ')})
        VALUES (${Object.keys(activityData).map((_, i) => `$${i + 1}`).join(', ')})
        RETURNING 
          id, action, "entityType" as "entityType", "entityId" as "entityId", 
          metadata, "ipAddress" as "ipAddress", "userAgent" as "userAgent", 
          "userId" as "userId", "projectId" as "projectId", "createdAt" as "createdAt"
      `;
            const values = Object.values(activityData);
            const activity = (await this.prisma.$queryRawUnsafe(query, ...values))[0];
            let user = null;
            if (userId) {
                user = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });
            }
            const activityWithUser = {
                id: activity.id,
                action: activity.action,
                entityType: activity.entityType,
                entityId: activity.entityId,
                metadata: activity.metadata,
                createdAt: activity.createdAt,
                ipAddress: activity.ipAddress,
                userAgent: activity.userAgent,
                userId: activity.userId,
                projectId: activity.projectId,
                user: user,
            };
            if (this.server) {
                const room = projectId ? `project:${projectId}` : `user:${userId || 'system'}`;
                const eventData = {
                    ...activityWithUser,
                    user: activityWithUser.user || null,
                    projectId: activityWithUser.projectId || null,
                    userId: activityWithUser.userId || null
                };
                this.server.to(room).emit('activity', eventData);
                this.server.emit('activity', eventData);
            }
            this.eventEmitter.emit('activity.created', activityWithUser);
            this.logger.debug(`Activity logged: ${action} for project ${projectId} by user ${userId}`);
            return activityWithUser;
        }
        catch (error) {
            this.logger.error(`Failed to log activity: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getActivities(options) {
        const { projectId, userId, action, entityType, entityId, limit = 50, cursor } = options;
        const whereClauses = [];
        const params = [];
        let paramIndex = 1;
        if (projectId) {
            whereClauses.push(`"projectId" = $${paramIndex++}`);
            params.push(projectId);
        }
        if (userId) {
            whereClauses.push(`"userId" = $${paramIndex++}`);
            params.push(userId);
        }
        if (action) {
            whereClauses.push(`"action" = $${paramIndex++}`);
            params.push(action);
        }
        if (entityType) {
            whereClauses.push(`"entityType" = $${paramIndex++}`);
            params.push(entityType);
        }
        if (entityId) {
            whereClauses.push(`"entityId" = $${paramIndex++}`);
            params.push(entityId);
        }
        if (cursor) {
            whereClauses.push(`id < $${paramIndex++}`);
            params.push(cursor);
        }
        const whereClause = whereClauses.length > 0
            ? `WHERE ${whereClauses.join(' AND ')}`
            : '';
        const query = `
      SELECT 
        a.id, a.action, a."entityType", a."entityId", a.metadata, 
        a."ipAddress", a."userAgent", a."userId", a."projectId", a."createdAt",
        u.id as "user.id", u.name as "user.name", u.email as "user.email"
      FROM "ActivityLog" a
      LEFT JOIN "User" u ON a."userId" = u.id
      ${whereClause}
      ORDER BY a."createdAt" DESC
      LIMIT $${paramIndex++}
    `;
        params.push(limit);
        const activities = await this.prisma.$queryRawUnsafe(query, ...params);
        return activities.map(row => ({
            id: row.id,
            action: row.action,
            entityType: row.entityType,
            entityId: row.entityId,
            metadata: row.metadata,
            ipAddress: row.ipAddress,
            userAgent: row.userAgent,
            userId: row.userId,
            projectId: row.projectId,
            createdAt: row.createdAt,
            user: row["user.id"] ? {
                id: row["user.id"],
                name: row["user.name"] || null,
                email: row["user.email"],
            } : null,
        }));
    }
    async getActivitySummary(projectId, days = 7) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.prisma.$queryRaw `
      SELECT 
        DATE("createdAt") as date,
        "action" as event,
        COUNT(*) as count
      FROM "ActivityLog"
      WHERE "projectId" = ${projectId}
        AND "createdAt" >= ${date}
      GROUP BY DATE("createdAt"), "action"
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], ActivityLoggerService);
exports.ActivityLoggerService = ActivityLoggerService;
//# sourceMappingURL=activity-logger.service.js.map