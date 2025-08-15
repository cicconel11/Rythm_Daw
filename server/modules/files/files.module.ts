import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AwsS3Service } from './aws-s3.service';
import { FileTransferGateway } from './file-transfer.gateway';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FilesController],
  providers: [FilesService, AwsS3Service, FileTransferGateway],
  exports: [FilesService, AwsS3Service],
})
export class FilesModule {}
