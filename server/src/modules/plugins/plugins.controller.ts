import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PluginsService } from './plugins.service';
import { Request } from 'express';

@Controller('plugins')
export class PluginsController {
  constructor(private readonly pluginsService: PluginsService) {}

  @Get('latest')
  async getLatestPlugin() {
    return this.pluginsService.getLatestPlugin();
  }

  @Post('scan')
  async scanPlugins(@Req() req: Request) {
    const userId = 'test-user';
    return this.pluginsService.scanUserPlugins(userId);
  }
} 