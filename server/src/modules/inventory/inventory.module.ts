import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { InventoryGateway } from './inventory.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryGateway],
  exports: [InventoryService, InventoryGateway],
})
export class InventoryModule {}
