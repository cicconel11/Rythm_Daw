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
    return this.prisma.$transaction(async (prisma: unknown) => {
      // 1. Upsert all plugins
      const upsertedPlugins = await Promise.all(
        plugins.map((plugin) =>
          (prisma as unknown as { plugin: { upsert: (args: unknown) => Promise<unknown> } }).plugin.upsert({
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

      // Get the Prisma userPlugin delegate with proper typing
      const userPlugin = (prisma as unknown as { userPlugin: { findMany: (args: unknown) => Promise<Array<{ pluginId: string }>>; createMany: (args: unknown) => Promise<unknown>; deleteMany: (args: unknown) => Promise<unknown>; updateMany: (args: unknown) => Promise<unknown>; } }).userPlugin;

      // 2. Get current user plugins using the userPlugin delegate
      const currentUserPlugins = await userPlugin.findMany({
        where: { userId },
        select: { pluginId: true },
      });

      const currentPluginUids = new Set<string>(currentUserPlugins.map((up: { pluginId: string }) => up.pluginId));
      const newPluginUids = new Set<string>(plugins.map((p: PluginDto) => p.uid));

      // 3. Find plugins to add and remove
      const pluginsToAdd = Array.from(newPluginUids).filter((uid: string) => !currentPluginUids.has(uid));
      const pluginsToRemove = Array.from(currentPluginUids).filter((uid: string) => !newPluginUids.has(uid));

      // 4. Update user plugins
      const updatePromises: Promise<unknown>[] = [];
      
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
        
        const existingPluginIds = new Set(existingUserPlugins.map((up: { pluginId: string }) => up.pluginId));
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
      await (prisma as unknown as { user: { update: (args: unknown) => Promise<unknown> } }).user.update({
        where: { id: userId },
        data: {
          inventoryHash,
          lastInventorySync: new Date(),
        },
      });

      // 6. Get the complete updated inventory
      const updatedInventory = await (prisma as unknown as { userPlugin: { findMany: (args: unknown) => Promise<Array<{ plugin: unknown; isActive: boolean; updatedAt: Date }>> } }).userPlugin.findMany({
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
        inventory: updatedInventory.map((up: { plugin: unknown; isActive: boolean; updatedAt: Date }) => ({
          ...(typeof up.plugin === 'object' && up.plugin !== null ? up.plugin : {}),
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
    return (this.prisma as unknown as { userPlugin: { findMany: (args: unknown) => Promise<Array<{ plugin: unknown; isActive: boolean; updatedAt: Date }>> } }).userPlugin.findMany({
      where: { userId },
      include: {
        plugin: true,
      },
    });
  }
}
