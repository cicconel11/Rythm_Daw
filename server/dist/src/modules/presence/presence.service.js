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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenceService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
let PresenceService = class PresenceService {
    constructor() {
        this.userPresence = new Map();
        this.HEARTBEAT_INTERVAL = 25000;
        this.cleanupInterval = setInterval(() => this.cleanupDisconnectedUsers(), this.HEARTBEAT_INTERVAL * 3);
    }
    onModuleDestroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
    updateUserPresence(userId) {
        this.userPresence.set(userId, {
            userId,
            lastSeen: new Date(),
        });
    }
    removeUserPresence(userId) {
        this.userPresence.delete(userId);
    }
    isOnline(userId) {
        const presence = this.userPresence.get(userId);
        if (!presence)
            return false;
        const now = new Date();
        const lastSeen = presence.lastSeen.getTime();
        const timeDiff = now.getTime() - lastSeen;
        return timeDiff < 30000;
    }
    cleanupDisconnectedUsers() {
        const now = new Date();
        const offlineThreshold = now.getTime() - 30000;
        for (const [userId, presence] of this.userPresence.entries()) {
            if (presence.lastSeen.getTime() < offlineThreshold) {
                this.userPresence.delete(userId);
            }
        }
    }
    async updateHeartbeat(userId, dto) {
        this.updateUserPresence(userId);
    }
    async getUserPresence(userId) {
        return this.isOnline(userId);
    }
    async getProjectPresence(projectId) {
        const result = [];
        for (const [userId, presence] of this.userPresence.entries()) {
            result.push({
                userId,
                isOnline: this.isOnline(userId),
            });
        }
        return result;
    }
};
exports.PresenceService = PresenceService;
__decorate([
    (0, schedule_1.Interval)(30000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PresenceService.prototype, "cleanupDisconnectedUsers", null);
exports.PresenceService = PresenceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PresenceService);
//# sourceMappingURL=presence.service.js.map