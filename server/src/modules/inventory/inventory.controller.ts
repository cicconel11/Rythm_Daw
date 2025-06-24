import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { SyncInventoryDto } from './dto/sync-inventory.dto';
import { InventoryService } from './inventory.service';

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
    @Req() req: Request,
    @Body() dto: SyncInventoryDto,
  ) {
    const userId = req.user.sub; // Set by JwtAuthGuard
    return this.inventoryService.syncUserInventory(userId, dto);
  }
}
