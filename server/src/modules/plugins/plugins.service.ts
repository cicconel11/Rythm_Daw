import { Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PluginsService {
  constructor(private config: ConfigService) {}

  private s3 = new S3Client({ region: this.config.get('AWS_REGION') });

  async getLatest(platform = 'mac'): Promise<{ url: string; filename: string }> {
    // TODO: pull from Prisma; hard-code for now
    const _platform = process.platform;
    const Key = 'installers/Rythm-0.9.3.dmg';
    const Bucket = this.config.get('PLUGIN_BUCKET');
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket, Key }),
      { expiresIn: 60 },
    );
    return { url, filename: 'Rythm-0.9.3.dmg' };
  }
} 