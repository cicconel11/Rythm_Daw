import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { CreateSnapshotDto, FileMetadataDto } from './dto/create-snapshot.dto';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class SnapshotsService {
  private readonly logger = new Logger(SnapshotsService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly presignedUrlExpiration = 3600; // 1 hour

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('S3_SNAPSHOTS_BUCKET') || 'rhythm-snapshots';
  }

  async createSnapshot(userId: string, dto: CreateSnapshotDto, file?: Express.Multer.File) {
    const { projectId, ...snapshotData } = dto;
    const snapshotId = uuidv4();
    
    // Verify project exists and user has access
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, members: { where: { userId } } },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.members.length === 0) {
      throw new BadRequestException('You do not have permission to create snapshots for this project');
    }

    let fileMetadata: FileMetadataDto[] = [];
    
    // Handle file upload if present
    if (file) {
      const fileKey = `snapshots/${projectId}/${snapshotId}.zip`;
      await this.uploadToS3(file.buffer, fileKey, file.mimetype);
      
      fileMetadata = [{
        path: 'snapshot.zip',
        hash: this.generateFileHash(file.buffer),
        mimeType: file.mimetype,
        size: file.size,
      }];
    }

    // Create snapshot record
    const snapshot = await this.prisma.snapshot.create({
      data: {
        id: snapshotId,
        name: snapshotData.name,
        description: snapshotData.description,
        metadata: snapshotData.metadata,
        projectId,
        createdById: userId,
        files: fileMetadata,
      },
    });

    return snapshot;
  }

  async getProjectSnapshots(projectId: string, userId: string) {
    // Verify project access
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, members: { where: { userId } } },
    });

    if (!project || project.members.length === 0) {
      throw new NotFoundException('Project not found or access denied');
    }

    // Get snapshots with signed URLs for files
    const snapshots = await this.prisma.snapshot.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Generate signed URLs for files
    const snapshotsWithUrls = await Promise.all(
      snapshots.map(async (snapshot) => {
        const files = await Promise.all(
          (snapshot.files as any[]).map(async (file) => ({
            ...file,
            downloadUrl: await this.generateDownloadUrl(projectId, snapshot.id, file.path),
          })),
        );
        return {
          ...snapshot,
          files,
        };
      }),
    );

    return snapshotsWithUrls;
  }

  async getSnapshotById(projectId: string, snapshotId: string, userId: string) {
    // Verify project access
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, members: { where: { userId } } },
    });

    if (!project || project.members.length === 0) {
      throw new NotFoundException('Project not found or access denied');
    }

    // Get snapshot with signed URLs for files
    const snapshot = await this.prisma.snapshot.findUnique({
      where: { id: snapshotId, projectId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }

    // Generate signed URLs for files
    const files = await Promise.all(
      (snapshot.files as any[]).map(async (file) => ({
        ...file,
        downloadUrl: await this.generateDownloadUrl(projectId, snapshotId, file.path),
      })),
    );

    return {
      ...snapshot,
      files,
    };
  }

  private async uploadToS3(buffer: Buffer, key: string, contentType: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });
      
      await this.s3Client.send(command);
      return key;
    } catch (error) {
      this.logger.error('Error uploading to S3', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  private async generateDownloadUrl(projectId: string, snapshotId: string, filePath: string): Promise<string> {
    try {
      const key = `snapshots/${projectId}/${snapshotId}/${filePath}`;
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return getSignedUrl(this.s3Client, command, { expiresIn: this.presignedUrlExpiration });
    } catch (error) {
      this.logger.error('Error generating download URL', error);
      return '';
    }
  }

  private generateFileHash(buffer: Buffer): string {
    // In a real implementation, use a proper hashing algorithm
    // This is a simplified version for demonstration
    return require('crypto').createHash('sha256').update(buffer).digest('hex');
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
