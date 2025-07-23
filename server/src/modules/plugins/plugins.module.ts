import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PluginsService } from './plugins.service';
import { PluginsController } from './plugins.controller';

@Module({
  imports: [ConfigModule],
  providers: [PluginsService],
  controllers: [PluginsController],
})
export class PluginsModule {} 