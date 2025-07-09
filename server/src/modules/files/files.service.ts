import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FileMetaDto } from './dto/file-meta.dto';
import { AwsS3Service } from './aws-s3.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FilesService {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  async getPresignedPair(dto: FileMetaDto, user: User) {
    const key = `${user.id}/${uuidv4()}-${dto.name}`;
    return this.awsS3Service.getPresignedPair(key, dto.mime, dto.size);
  }
}
