import { Request } from 'express';
import { SyncInventoryDto } from './dto/sync-inventory.dto';
import { InventoryService } from './inventory.service';
interface RequestWithUser extends Request {
    user: {
        sub: string;
        email: string;
        [key: string]: any;
    };
}
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    syncInventory(req: RequestWithUser, dto: SyncInventoryDto): Promise<{
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
}
export {};
