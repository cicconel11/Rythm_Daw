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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ioredis_1 = require("ioredis");
let RootController = class RootController {
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    root() {
        return 'OK';
    }
    async healthz() {
        let db = 'ok';
        try {
            await this.prisma.$queryRaw `SELECT 1`;
        }
        catch (e) {
            db = 'fail';
        }
        let redis = 'ok';
        try {
            await this.redis.ping();
        }
        catch (e) {
            redis = 'fail';
        }
        return {
            status: db === 'ok' && redis === 'ok' ? 'ok' : 'fail',
            db,
            redis,
            uptime: process.uptime(),
        };
    }
};
exports.RootController = RootController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RootController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('healthz'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RootController.prototype, "healthz", null);
exports.RootController = RootController = __decorate([
    (0, common_1.Controller)('/'),
    __param(1, (0, common_1.Inject)('REDIS_CLIENT')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ioredis_1.Redis])
], RootController);
//# sourceMappingURL=root.controller.js.map