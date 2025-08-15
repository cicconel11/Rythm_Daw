import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AwsS3Service } from './aws-s3.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { FileTransferGateway } from './file-transfer.gateway';
import { ActivitiesModule } from '../../activities/activities.module';

@Module({
  imports: [ConfigModule, PrismaModule, ActivitiesModule],
  controllers: [FilesController],
  providers: [FilesService, AwsS3Service, FileTransferGateway],
  exports: [FilesService],
})
export class FilesModule {}
