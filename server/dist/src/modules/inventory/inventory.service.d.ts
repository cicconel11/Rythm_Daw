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
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            version: string;
        }[];
    }>;
    getUserInventory(userId: string): Promise<({
        plugin: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            version: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        pluginId: string;
        isActive: boolean;
    })[]>;
}
