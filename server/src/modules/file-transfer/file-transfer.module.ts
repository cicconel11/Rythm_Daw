import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { FileTransferGateway } from './file-transfer.gateway';
import { FileTransferService } from './file-transfer.service';
import { FileTransferController } from './file-transfer.controller';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
  ],
  providers: [
    FileTransferGateway,
    FileTransferService,
  ],
  controllers: [FileTransferController],
  exports: [FileTransferGateway, FileTransferService],
})
export class FileTransferModule {}
