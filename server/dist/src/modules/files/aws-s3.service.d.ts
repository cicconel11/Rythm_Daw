import { ConfigService } from '@nestjs/config';
export declare class AwsS3Service {
    private configService;
    private readonly s3;
    private readonly bucketName;
    private mockPair;
    constructor(configService: ConfigService);
    getPresignedPair(key: string, contentType?: string, contentLength?: number): Promise<{
        putUrl: string;
        getUrl: string;
    } | {
        uploadUrl: string;
        downloadUrl: string;
    }>;
}
