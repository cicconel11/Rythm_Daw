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
var InventoryService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const inventory_gateway_1 = require("./inventory.gateway");
const event_emitter_1 = require("@nestjs/event-emitter");
let InventoryService = InventoryService_1 = class InventoryService {
    constructor(prisma, inventoryGateway, eventEmitter) {
        this.prisma = prisma;
        this.inventoryGateway = inventoryGateway;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(InventoryService_1.name);
    }
    async syncUserInventory(userId, dto) {
        const { plugins, inventoryHash } = dto;
        return this.prisma.$transaction(async (prisma) => {
            const upsertedPlugins = await Promise.all(plugins.map((plugin) => prisma.plugin.upsert({
                where: { uid: plugin.uid },
                update: {
                    name: plugin.name,
                    vendor: plugin.vendor,
                    version: plugin.version,
                    lastSeen: new Date(),
                },
                create: {
                    uid: plugin.uid,
                    name: plugin.name,
                    vendor: plugin.vendor,
                    version: plugin.version,
                    lastSeen: new Date(),
                },
            })));
            const currentUserPlugins = await prisma.userPlugins.findMany({
                where: { userId },
                select: { pluginUid: true },
            });
            const currentPluginUids = new Set(currentUserPlugins.map((up) => up.pluginUid));
            const newPluginUids = new Set(plugins.map((p) => p.uid));
            const pluginsToAdd = [...newPluginUids].filter((uid) => !currentPluginUids.has(uid));
            const pluginsToRemove = [...currentPluginUids].filter((uid) => !newPluginUids.has(uid));
            await Promise.all([
                pluginsToAdd.length > 0 &&
                    prisma.userPlugins.createMany({
                        data: pluginsToAdd.map((pluginUid) => ({
                            userId,
                            pluginUid,
                            isActive: true,
                            lastSynced: new Date(),
                        })),
                        skipDuplicates: true,
                    }),
                pluginsToRemove.length > 0 &&
                    prisma.userPlugins.deleteMany({
                        where: {
                            userId,
                            pluginUid: { in: [...pluginsToRemove] },
                        },
                    }),
                prisma.userPlugins.updateMany({
                    where: {
                        userId,
                        pluginUid: { in: [...newPluginUids] },
                    },
                    data: {
                        lastSynced: new Date(),
                    },
                }),
            ]);
            await prisma.user.update({
                where: { id: userId },
                data: {
                    inventoryHash,
                    lastInventorySync: new Date(),
                },
            });
            const updatedInventory = await prisma.userPlugins.findMany({
                where: { userId },
                include: {
                    plugin: true,
                },
            });
            const eventData = {
                userId,
                timestamp: new Date(),
                added: pluginsToAdd,
                removed: pluginsToRemove,
                inventory: updatedInventory.map((up) => ({
                    ...up.plugin,
                    isActive: up.isActive,
                    lastSynced: up.lastSynced,
                })),
            };
            this.inventoryGateway.broadcastInventoryUpdate(userId, eventData);
            this.eventEmitter.emit('inventory.updated', eventData);
            this.logger.log(`Inventory synced for user ${userId}: ${pluginsToAdd.length} added, ${pluginsToRemove.length} removed`);
            return eventData;
        });
    }
    async getUserInventory(userId) {
        return this.prisma.userPlugins.findMany({
            where: { userId },
            include: {
                plugin: true,
            },
        });
    }
};
InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, inventory_gateway_1.InventoryGateway, typeof (_b = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _b : Object])
], InventoryService);
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map