import { Request } from 'express';
import { SyncInventoryDto } from './dto/sync-inventory.dto';
import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    syncInventory(req: Request, dto: SyncInventoryDto): Promise<any>;
}
