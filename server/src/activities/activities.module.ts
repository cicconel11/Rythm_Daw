import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityGateway } from './activities.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, ActivityGateway, PrismaService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
