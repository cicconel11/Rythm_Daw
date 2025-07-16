import { Injectable, Logger, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { CreateSnapshotDto, FileMetadataDto } from './dto/create-snapshot.dto';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import * as crypto from 'crypto';

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
    const awsRegion = this.configService.get<string>('AWS_REGION');
    const awsAccessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    
    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
      throw new Error('AWS configuration is missing. Please set AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY environment variables.');
    }

    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    
    this.bucketName = this.configService.get<string>('S3_SNAPSHOTS_BUCKET') || 'rhythm-snapshots';
  }

  async createSnapshot(userId: string, dto: CreateSnapshotDto, file?: Express.Multer.File) {
    const { projectId, ...snapshotData } = dto;
    const snapshotId = uuidv4();
    
    // Verify project exists
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // For now, allow any authenticated user to create snapshots for public projects
    // In a real application, you might want to implement more granular permissions
    if (!project.isPublic) {
      throw new BadRequestException('This project is not public');
    }

    let fileMetadata: FileMetadataDto[] = [];
    
    // Handle file upload if present
    if (file) {
      const fileKey = `snapshots/${projectId}/${snapshotId}.zip`;
      await this.uploadToS3(file.buffer, fileKey, file.mimetype);
      
      fileMetadata = [{
        path: 'snapshot.zip',
        hash: crypto.createHash('sha256').update(file.buffer).digest('hex'),
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
        data: JSON.stringify({ files: fileMetadata }),
        projectId,
      },
    });

    return snapshot;
  }

  async getProjectSnapshots(projectId: string, userId: string) {
    // Verify project exists and is public
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Only allow access to public projects for now
    if (!project.isPublic) {
      throw new BadRequestException('This project is not public');
    }

    // Get snapshots with basic project info
    const snapshots = await this.prisma.snapshot.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            isPublic: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Generate signed URLs for files
    const snapshotsWithUrls = await Promise.all(
      snapshots.map(async (snapshot) => {
        const files: Array<{ path: string; downloadUrl: string }> = [];
        try {
          const snapshotData = snapshot.data as { files?: Array<{ path: string }> };
          if (snapshotData?.files?.length) {
            const filePromises = snapshotData.files.map(async (file) => ({
              ...file,
              downloadUrl: await this.generateDownloadUrl(projectId, snapshot.id, file.path),
            }));
            
            const processedFiles = await Promise.all(filePromises);
            files.push(...processedFiles);
          }
        } catch (error) {
          this.logger.error('Error processing snapshot files', error);
        }
        
        return {
          ...snapshot,
          files,
        } as any; // Using any to avoid complex type assertions
      }),
    );

    return snapshotsWithUrls;
  }

  async getSnapshotById(projectId: string, snapshotId: string, userId: string) {
    // Verify project exists and is public
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (!project.isPublic) {
      throw new BadRequestException('This project is not public');
    }

    // Get snapshot with signed URLs for files
    const snapshot = await this.prisma.snapshot.findUnique({
      where: { id: snapshotId, projectId },
    });

    if (!snapshot) {
      throw new NotFoundException('Snapshot not found');
    }

    // Process files
    let files: Array<{ path: string; downloadUrl: string }> = [];
    try {
      const snapshotData = snapshot.data as { files?: Array<{ path: string }> };
      if (snapshotData?.files?.length) {
        files = await Promise.all(
          snapshotData.files.map(async (file) => ({
            ...file,
            downloadUrl: await this.generateDownloadUrl(projectId, snapshotId, file.path),
          })),
        );
      }
    } catch (error) {
      this.logger.error('Error processing snapshot files', error);
    }

    return {
      ...snapshot,
      files,
    };
  }

  private generateFileHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  private async generateDownloadUrl(projectId: string, snapshotId: string, filePath: string): Promise<string> {
    try {
      const fileKey = `snapshots/${projectId}/${snapshotId}/${filePath}`;
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      return getSignedUrl(this.s3Client, command, { expiresIn: this.presignedUrlExpiration });
    } catch (error) {
      this.logger.error(`Error generating download URL for ${filePath}`, error);
      throw new InternalServerErrorException('Failed to generate download URL');
    }
  }

  private async uploadToS3(buffer: Buffer, key: string, contentType: string): Promise<string> {
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

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
