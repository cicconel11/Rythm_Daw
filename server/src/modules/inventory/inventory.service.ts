import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryGateway } from './inventory.gateway';
import { PluginDto, SyncInventoryDto } from './dto/sync-inventory.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private prisma: PrismaService,
    private readonly inventoryGateway: InventoryGateway,
    private eventEmitter: EventEmitter2,
  ) {}

  async syncUserInventory(userId: string, dto: SyncInventoryDto) {
    const { plugins, inventoryHash } = dto;
    
    // Start a transaction to ensure data consistency
    return this.prisma.$transaction(async (prisma) => {
      // 1. Upsert all plugins
      const upsertedPlugins = await Promise.all(
        plugins.map((plugin) =>
          prisma.plugin.upsert({
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
          }),
        ),
      );

      // 2. Get current user plugins
      const currentUserPlugins = await prisma.userPlugins.findMany({
        where: { userId },
        select: { pluginUid: true },
      });

      const currentPluginUids = new Set(currentUserPlugins.map((up) => up.pluginUid));
      const newPluginUids = new Set(plugins.map((p) => p.uid));

      // 3. Find plugins to add and remove
      const pluginsToAdd = [...newPluginUids].filter((uid) => !currentPluginUids.has(uid));
      const pluginsToRemove = [...currentPluginUids].filter((uid) => !newPluginUids.has(uid));

      // 4. Update user plugins
      await Promise.all([
        // Add new plugins
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

        // Remove old plugins
        pluginsToRemove.length > 0 &&
          prisma.userPlugins.deleteMany({
            where: {
              userId,
              pluginUid: { in: [...pluginsToRemove] },
            },
          }),

        // Update lastSynced for existing plugins
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

      // 5. Update user's inventory hash
      await prisma.user.update({
        where: { id: userId },
        data: {
          inventoryHash,
          lastInventorySync: new Date(),
        },
      });

      // 6. Get the complete updated inventory
      const updatedInventory = await prisma.userPlugins.findMany({
        where: { userId },
        include: {
          plugin: true,
        },
      });

      // 7. Emit events
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

      // Emit to WebSocket
      this.inventoryGateway.broadcastInventoryUpdate(userId, eventData);
      
      // Emit to event system
      this.eventEmitter.emit('inventory.updated', eventData);

      this.logger.log(`Inventory synced for user ${userId}: ${pluginsToAdd.length} added, ${pluginsToRemove.length} removed`);

      return eventData;
    });
  }

  async getUserInventory(userId: string) {
    return this.prisma.userPlugins.findMany({
      where: { userId },
      include: {
        plugin: true,
      },
    });
  }
}
