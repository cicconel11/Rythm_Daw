import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivitiesDto } from './dto/query-activities.dto';
import { ActivityGateway } from './activities.gateway';

@Controller('activities')
export class ActivitiesController {
  constructor(private svc: ActivitiesService, private gw: ActivityGateway) {}

  @Get()
  list(@Query() q: QueryActivitiesDto) {
    return this.svc.list(q);
  }

  @Post()
  async create(@Body() dto: CreateActivityDto) {
    const a = await this.svc.create(dto);
    this.gw.broadcastNew(a);
    return a;
  }
}
