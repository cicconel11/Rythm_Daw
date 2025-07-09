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
          }),
        ),
      );

      // Get the Prisma userPlugin delegate
      const userPlugin = prisma.userPlugin;

      // 2. Get current user plugins using the userPlugin delegate
      const currentUserPlugins = await userPlugin.findMany({
        where: { userId },
        select: { pluginId: true },
      });

      const currentPluginUids = new Set(currentUserPlugins.map((up: { pluginId: string }) => up.pluginId));
      const newPluginUids = new Set(plugins.map((p) => p.uid));

      // 3. Find plugins to add and remove
      const pluginsToAdd = [...newPluginUids].filter((uid) => !currentPluginUids.has(uid));
      const pluginsToRemove = [...currentPluginUids].filter((uid) => !newPluginUids.has(uid));

      // 4. Update user plugins
      const updatePromises = [];
      
      // Add new plugins
      if (pluginsToAdd.length > 0) {
        // First, find existing user plugins to avoid duplicates
        const existingUserPlugins = await userPlugin.findMany({
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
          updatePromises.push(
            userPlugin.createMany({
              data: pluginsToCreate.map((pluginId) => ({
                userId,
                pluginId,
                isActive: true,
              }))
            })
          );
        }
      }

      // Remove old plugins
      if (pluginsToRemove.length > 0) {
        updatePromises.push(
          userPlugin.deleteMany({
            where: {
              userId,
              pluginId: { in: [...pluginsToRemove] },
            },
          })
        );
      }

      // Update lastSynced for existing plugins
      if (newPluginUids.size > 0) {
        updatePromises.push(
          userPlugin.updateMany({
            where: {
              userId,
              pluginId: { in: [...newPluginUids] },
            },
            data: {
              updatedAt: new Date(),
            },
          })
        );
      }

      await Promise.all(updatePromises);

      // 5. Update user's inventory hash
      await prisma.user.update({
        where: { id: userId },
        data: {
          inventoryHash,
          lastInventorySync: new Date(),
        },
      });

      // 6. Get the complete updated inventory
      const updatedInventory = await prisma.userPlugin.findMany({
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
          lastSynced: up.updatedAt,
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
    return this.prisma.userPlugin.findMany({
      where: { userId },
      include: {
        plugin: true,
      },
    });
  }
}
