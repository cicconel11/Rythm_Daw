import { FileMetaDto } from './dto/file-meta.dto';
import { AwsS3Service } from './aws-s3.service';
import { User } from '../users/entities/user.entity';
export declare class FilesService {
    private readonly awsS3Service;
    constructor(awsS3Service: AwsS3Service);
    getPresignedPair(dto: FileMetaDto, user: User): Promise<{
        uploadUrl: string;
        downloadUrl: string;
    }>;
}
