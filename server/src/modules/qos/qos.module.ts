import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { QosController } from './qos.controller';
import { QosService } from './qos.service';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
  ],
  controllers: [QosController],
  providers: [QosService, EncryptionService],
  exports: [QosService, EncryptionService],
})
export class QosModule implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly qosService: QosService) {}

  async onModuleInit() {
    // Initialize any required resources
  }

  async onModuleDestroy() {
    // Clean up resources
    await this.qosService.onModuleDestroy();
  }
}
