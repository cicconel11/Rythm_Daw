import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SyncInventoryDto } from './dto/sync-inventory.dto';
import { InventoryService } from './inventory.service';
import type { RequestWithUser } from '../../constants/request-with-user';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Synchronize user plugin inventory' })
  @ApiResponse({ status: 200, description: 'Inventory synchronized successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async syncInventory(
    @Req() req: RequestWithUser,
    @Body() dto: SyncInventoryDto,
  ) {
    const userId = req.user.userId; // Set by JwtAuthGuard
    return this.inventoryService.syncUserInventory(userId, dto);
  }
}
