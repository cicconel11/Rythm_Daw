import { ConfigService } from '@nestjs/config';
export declare class AwsS3Service {
    private configService;
    private readonly s3;
    private readonly bucketName;
    constructor(configService: ConfigService);
    getPresignedPair(key: string, contentType: string, contentLength: number): Promise<{
        uploadUrl: string;
        downloadUrl: string;
    }>;
}
