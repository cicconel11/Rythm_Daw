import { SyncInventoryDto } from './dto/sync-inventory.dto';
import { InventoryService } from './inventory.service';
import { RequestWithUser } from '../../constants/request-with-user';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    syncInventory(req: RequestWithUser, dto: SyncInventoryDto): Promise<{
        userId: string;
        timestamp: Date;
        added: string[];
        removed: string[];
        inventory: any;
    }>;
}
