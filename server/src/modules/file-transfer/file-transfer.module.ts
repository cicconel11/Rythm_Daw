import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileTransferGateway } from './file-transfer.gateway';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    FileTransferGateway,
  ],
  exports: [FileTransferGateway],
})
export class FileTransferModule {}
