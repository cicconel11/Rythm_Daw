import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [ConfigModule],
  controllers: [FilesController],
  providers: [FilesService, AwsS3Service],
  exports: [FilesService],
})
export class FilesModule {}
