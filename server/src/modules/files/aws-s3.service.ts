import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('S3_BUCKET');

    // Allow unit tests to run without real credentials
    if (process.env.NODE_ENV === 'test') {
      this.s3Client = new S3Client({
        region: region ?? 'us-east-1',
        credentials: { accessKeyId: 'TEST', secretAccessKey: 'TEST' },
      });
      this.bucketName = bucketName ?? 'rhythm-test';
      return;
    }

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Missing required AWS configuration');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  async getPresignedPair(key: string, contentType: string, contentLength: number) {
    const putCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
    });

    const getCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const [putUrl, getUrl] = await Promise.all([
      getSignedUrl(this.s3Client, putCommand, { expiresIn: 3600 }), // 1 hour
      getSignedUrl(this.s3Client, getCommand, { expiresIn: 86400 * 7 }), // 7 days
    ]);

    return { putUrl, getUrl };
  }
}
