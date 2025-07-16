import { ConfigService } from '@nestjs/config';
export declare class AwsS3Service {
    private configService;
    private readonly s3Client;
    private readonly bucketName;
    constructor(configService: ConfigService);
    getPresignedPair(key: string, contentType: string, contentLength: number): Promise<{
        putUrl: string;
        getUrl: string;
    }>;
}
