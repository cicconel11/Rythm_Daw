import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'MOCK_ACCESS_KEY',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'MOCK_SECRET_KEY',
  ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? {
    s3ForcePathStyle: true,
    endpoint: 'http://localhost:4566' // LocalStack endpoint
  } : {})
});

@Injectable()
export class AwsS3Service {
  private readonly s3: AWS.S3;
  private readonly bucketName: string;

  /** Quick stub for unit tests */
  private mockPair(key: string) {
    if (process.env.NODE_ENV === 'test') {
      const base = `https://s3.amazonaws.com/test-bucket/${key}`;
      return { putUrl: base, getUrl: base };
    }
    return null;
  }

  constructor(private configService: ConfigService) {
    const bucketName = this.configService.get<string>('S3_BUCKET');
    
    if (process.env.NODE_ENV === 'production') {
      const region = this.configService.get<string>('AWS_REGION');
      const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
      const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
      
      if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
        throw new Error('Missing required AWS configuration for production');
      }
    } else {
      console.warn('Running with mock S3 client - file operations will not persist');
    }

    this.s3 = new AWS.S3();
    this.bucketName = bucketName || 'rhythm-dev';
  }

  async getPresignedPair(key: string, contentType?: string, contentLength?: number) {
    // Return mock URLs in test environment
    if (process.env.NODE_ENV === 'test') {
      const base = `https://s3.amazonaws.com/test-bucket/${key}`;
      return Promise.resolve({
        putUrl: base,
        getUrl: base
      });
    }
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
      Expires: 3600, // 1 hour
    };

    try {
      const [uploadUrl, downloadUrl] = await Promise.all([
        this.s3.getSignedUrlPromise('putObject', params),
        this.s3.getSignedUrlPromise('getObject', {
          Bucket: this.bucketName,
          Key: key,
          Expires: 86400, // 24 hours
        }),
      ]);

      return {
        uploadUrl,
        downloadUrl,
      };
    } catch (error) {
      console.error('Error generating presigned URLs:', error);
      throw new Error('Failed to generate presigned URLs');
    }
  }
}
