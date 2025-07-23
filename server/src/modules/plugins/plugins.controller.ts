import { Controller, Get, Query } from '@nestjs/common';
import { PluginsService } from './plugins.service';

@Controller('plugins')
export class PluginsController {
  constructor(private svc: PluginsService) {}

  @Get('latest')
  latest(@Query('platform') platform?: string) {
    return this.svc.getLatest(platform);
  }
} 