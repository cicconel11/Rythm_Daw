import { Controller, Post, Get, Body, Param, UseGuards, Query } from '@nestjs/common';
import { FileMetaDto } from './dto/file-meta.dto';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivitiesService } from '../../activities/activities.service';

@Controller('api/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly prisma: PrismaService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  @Post('presign')
  async create(@Body() dto: FileMetaDto, @CurrentUser() user: User) {
    console.log('FilesController.create - input:', { dto, userId: user?.id });
    const result = await this.filesService.getPresignedPair(dto, user);
    console.log('FilesController.create - result:', result);
    
    // Log activity for file upload
    try {
      await this.activitiesService.create({
        type: 'FILE_UPLOAD',
        userId: user.id,
        actorId: user.id,
        projectId: dto.projectId,
        payload: {
          fileName: dto.fileName,
          size: dto.fileSize,
          mimeType: dto.mimeType,
          s3Key: result.uploadKey,
        }
      });
    } catch (error) {
      console.error('Failed to log file upload activity:', error);
    }
    
    return result;
  }

  // Add this for backward compatibility with tests
  @Post()
  async uploadFile(@Body() dto: FileMetaDto, @CurrentUser() user: User) {
    return this.filesService.getPresignedPair(dto, user);
  }

  @Get('transfers')
  async getTransfers(
    @CurrentUser() user: User,
    @Query('status') status?: string,
    @Query('direction') direction?: 'sent' | 'received',
  ) {
    const where: any = {};
    
    if (direction === 'sent') {
      where.fromUserId = user.id;
    } else if (direction === 'received') {
      where.toUserId = user.id;
    } else {
      where.OR = [
        { fromUserId: user.id },
        { toUserId: user.id },
      ];
    }

    if (status) {
      where.status = status;
    }

    const transfers = await this.prisma.fileTransfer.findMany({
      where,
      include: {
        fromUser: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          }
        },
        toUser: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    return transfers.map(transfer => ({
      id: transfer.id,
      file: {
        id: transfer.id,
        name: transfer.fileName,
        size: transfer.fileSize,
        type: transfer.mimeType,
        lastModified: transfer.createdAt.getTime(),
      },
      fromUser: transfer.fromUser ? {
        id: transfer.fromUser.id,
        name: transfer.fromUser.displayName || 'Unknown User',
        avatar: transfer.fromUser.avatarUrl,
        isOnline: true, // TODO: Get from presence service
      } : undefined,
      toUser: transfer.toUser ? {
        id: transfer.toUser.id,
        name: transfer.toUser.displayName || 'Unknown User',
        avatar: transfer.toUser.avatarUrl,
        isOnline: true, // TODO: Get from presence service
      } : undefined,
      status: transfer.status,
      progress: transfer.progress,
      timestamp: transfer.createdAt.toISOString(),
      direction: transfer.fromUserId === user.id ? 'sent' : 'received',
      // Plugin-specific fields
      projectId: transfer.projectId,
      peerId: transfer.peerId,
      transferType: transfer.transferType,
      sha256: transfer.sha256,
      chunkSize: transfer.chunkSize,
      totalChunks: transfer.totalChunks,
    }));
  }

  @Get(':transferId/download')
  async getDownloadUrl(@Param('transferId') transferId: string, @CurrentUser() user: User) {
    const transfer = await this.prisma.fileTransfer.findUnique({
      where: { id: transferId },
    });

    if (!transfer) {
      throw new Error('Transfer not found');
    }

    if (transfer.toUserId !== user.id && transfer.fromUserId !== user.id) {
      throw new Error('Not authorized to download this file');
    }

    if (!transfer.s3Key) {
      throw new Error('File not available for download');
    }

    // Get presigned download URL from S3
    const downloadUrl = await this.filesService.getDownloadUrl(transfer.s3Key);
    
    return { url: downloadUrl };
  }
}
