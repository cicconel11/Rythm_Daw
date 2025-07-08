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
                where: { id: plugin.uid },
                update: {
                    name: plugin.name,
                    version: plugin.version,
                    updatedAt: new Date(),
                },
                create: {
                    id: plugin.uid,
                    name: plugin.name,
                    version: plugin.version,
                    description: plugin.vendor,
                },
            })));
            const currentUserPlugins = await prisma.userPlugin.findMany({
                where: { userId },
                select: { pluginId: true },
            });
            const currentPluginUids = new Set(currentUserPlugins.map((up) => up.pluginId));
            const newPluginUids = new Set(plugins.map((p) => p.uid));
            const pluginsToAdd = [...newPluginUids].filter((uid) => !currentPluginUids.has(uid));
            const pluginsToRemove = [...currentPluginUids].filter((uid) => !newPluginUids.has(uid));
            const updatePromises = [];
            if (pluginsToAdd.length > 0) {
                const existingUserPlugins = await prisma.userPlugin.findMany({
                    where: {
                        userId,
                        pluginId: { in: [...pluginsToAdd] },
                    },
                    select: {
                        pluginId: true,
                    },
                });
                const existingPluginIds = new Set(existingUserPlugins.map(up => up.pluginId));
                const pluginsToCreate = pluginsToAdd.filter(pluginId => !existingPluginIds.has(pluginId));
                if (pluginsToCreate.length > 0) {
                    updatePromises.push(prisma.userPlugin.createMany({
                        data: pluginsToCreate.map((pluginId) => ({
                            userId,
                            pluginId,
                            isActive: true,
                        }))
                    }));
                }
            }
            if (pluginsToRemove.length > 0) {
                updatePromises.push(prisma.userPlugin.deleteMany({
                    where: {
                        userId,
                        pluginId: { in: [...pluginsToRemove] },
                    },
                }));
            }
            if (newPluginUids.size > 0) {
                updatePromises.push(prisma.userPlugin.updateMany({
                    where: {
                        userId,
                        pluginId: { in: [...newPluginUids] },
                    },
                    data: {
                        updatedAt: new Date(),
                    },
                }));
            }
            await Promise.all(updatePromises);
            await prisma.user.update({
                where: { id: userId },
                data: {
                    inventoryHash,
                    lastInventorySync: new Date(),
                },
            });
            const updatedInventory = await prisma.userPlugin.findMany({
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
                    lastSynced: up.updatedAt,
                })),
            };
            this.inventoryGateway.broadcastInventoryUpdate(userId, eventData);
            this.eventEmitter.emit('inventory.updated', eventData);
            this.logger.log(`Inventory synced for user ${userId}: ${pluginsToAdd.length} added, ${pluginsToRemove.length} removed`);
            return eventData;
        });
    }
    async getUserInventory(userId) {
        return this.prisma.userPlugin.findMany({
            where: { userId },
            include: {
                plugin: true,
            },
        });
    }
};
InventoryService = InventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inventory_gateway_1.InventoryGateway,
        event_emitter_1.EventEmitter2])
], InventoryService);
exports.InventoryService = InventoryService;
//# sourceMappingURL=inventory.service.js.map