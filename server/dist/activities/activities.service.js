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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ActivitiesService = class ActivitiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        var _a;
        return this.prisma.activity.create({
            data: Object.assign(Object.assign({}, dto), { payload: (_a = dto.payload) !== null && _a !== void 0 ? _a : {} })
        });
    }
    async list(q) {
        var _a, _b;
        const take = Math.min(Number((_a = q.take) !== null && _a !== void 0 ? _a : 30), 100);
        const where = {};
        if ((_b = q.type) === null || _b === void 0 ? void 0 : _b.length)
            where.type = { in: q.type };
        if (q.userId)
            where.userId = q.userId;
        if (q.actorId)
            where.actorId = q.actorId;
        if (q.projectId)
            where.projectId = q.projectId;
        if (q.start || q.end) {
            where.createdAt = {};
            if (q.start)
                where.createdAt.gte = new Date(q.start);
            if (q.end)
                where.createdAt.lte = new Date(q.end);
        }
        const cursor = q.cursor ? { id: q.cursor } : undefined;
        const items = await this.prisma.activity.findMany(Object.assign(Object.assign({ where, take: take + 1 }, (cursor ? { cursor, skip: 1 } : {})), { orderBy: { createdAt: 'desc' } }));
        const nextCursor = items.length > take ? items[take].id : null;
        return { items: items.slice(0, take), nextCursor };
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map