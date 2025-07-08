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
var PresenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
let PresenceService = PresenceService_1 = class PresenceService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(PresenceService_1.name);
        this.HEARTBEAT_TIMEOUT_MS = 15000;
        this.STALE_PRESENCE_MS = 60000;
    }
    onModuleInit() {
        this.logger.log('Presence service initialized');
    }
    async updateHeartbeat(userId, dto) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.HEARTBEAT_TIMEOUT_MS);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        const where = {
            id: userId,
        };
        const presence = await this.prisma.userPresence.upsert({
            where,
            update: {
                status: dto.status,
                lastSeen: now,
                expiresAt,
                projectId: dto.projectId || null,
            },
            create: {
                userId,
                status: dto.status,
                lastSeen: now,
                expiresAt,
                projectId: dto.projectId || null,
            },
        });
        this.eventEmitter.emit('presence.updated', {
            userId,
            status: dto.status,
            projectId: dto.projectId,
            timestamp: now,
        });
        if (dto.projectId) {
            this.eventEmitter.emit('project.presence', {
                projectId: dto.projectId,
                userId,
                status: dto.status,
                user: user,
            });
        }
        return presence;
    }
    async getUserPresence(userId) {
        const presences = await this.prisma.userPresence.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return presences.length > 0
            ? presences.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())[0]
            : null;
    }
    async getProjectPresence(projectId) {
        return this.prisma.userPresence.findMany({
            where: {
                projectId,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                lastSeen: 'desc',
            },
        });
    }
    async cleanupStalePresence() {
        const threshold = new Date(Date.now() - this.STALE_PRESENCE_MS);
        try {
            const result = await this.prisma.userPresence.deleteMany({
                where: {
                    expiresAt: {
                        lt: threshold,
                    },
                },
            });
            if (result.count > 0) {
                this.logger.log(`Cleaned up ${result.count} stale presence records`);
            }
            return result;
        }
        catch (error) {
            this.logger.error('Failed to clean up stale presence', error);
            throw error;
        }
    }
    async removePresence(userId, projectId) {
        if (projectId) {
            const presences = await this.prisma.userPresence.findMany({
                where: { userId },
                select: { id: true },
            });
            for (const presence of presences) {
                try {
                    await this.prisma.userPresence.delete({
                        where: { id: presence.id },
                    });
                }
                catch (error) {
                    if (!(error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025')) {
                        throw error;
                    }
                }
            }
        }
        else {
            await this.prisma.userPresence.deleteMany({
                where: { userId },
            });
        }
    }
};
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PresenceService.prototype, "cleanupStalePresence", null);
PresenceService = PresenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], PresenceService);
exports.PresenceService = PresenceService;
//# sourceMappingURL=presence.service.js.map