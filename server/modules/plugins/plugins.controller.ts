import { Controller, Post, Get, UseGuards, Query, Body, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { PairDeviceDto } from './dto/pair-device.dto';
import { PluginsService } from './plugins.service';

@ApiTags('plugins')
@Controller('plugins')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Post('pair')
  @ApiOperation({ summary: 'Initiate device pairing' })
  @ApiResponse({ status: 201, description: 'Pairing initiated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async pairDevice(
    @GetUser() user: User,
    @Body() pairDeviceDto: PairDeviceDto,
  ) {
    const { code } = pairDeviceDto;
    await this.pluginsService.initiatePairing(user.id, code);
    return { message: 'Pairing initiated' };
  }

  @Get('pair/status')
  @ApiOperation({ summary: 'Check pairing status' })
  @ApiResponse({ status: 200, description: 'Pairing status' })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  @ApiResponse({ status: 404, description: 'Pairing not found' })
  async checkPairingStatus(
    @Query('code') code: string,
  ) {
    if (!code) {
      throw new BadRequestException('Pairing code is required');
    }
    
    const status = await this.pluginsService.checkPairingStatus(code);
    return { status };
  }

  @Post('pair/confirm')
  @ApiOperation({ summary: 'Confirm device pairing' })
  @ApiResponse({ status: 200, description: 'Device paired successfully' })
  @ApiResponse({ status: 400, description: 'Invalid code' })
  @ApiResponse({ status: 404, description: 'Pairing not found' })
  async confirmPairing(
    @Query('code') code: string,
  ) {
    if (!code) {
      throw new BadRequestException('Pairing code is required');
    }
    
    const result = await this.pluginsService.confirmPairing(code);
    return { message: 'Device paired successfully', device: result };
  }
}
