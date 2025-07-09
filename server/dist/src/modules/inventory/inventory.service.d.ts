import { PrismaService } from '../../prisma/prisma.service';
import { InventoryGateway } from './inventory.gateway';
import { SyncInventoryDto } from './dto/sync-inventory.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class InventoryService {
    private prisma;
    private readonly inventoryGateway;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, inventoryGateway: InventoryGateway, eventEmitter: EventEmitter2);
    syncUserInventory(userId: string, dto: SyncInventoryDto): Promise<{
        userId: string;
        timestamp: Date;
        added: string[];
        removed: string[];
        inventory: {
            isActive: boolean;
            lastSynced: Date;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            version: string;
            deletedAt: Date | null;
        }[];
    }>;
    getUserInventory(userId: string): Promise<({
        plugin: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            version: string;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        userId: string;
        pluginId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
