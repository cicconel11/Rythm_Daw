import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { PresignDto, AcceptDto, DeclineDto } from './dto';
import { FileTransferSchema } from '../../../../shared/types';

@Injectable()
export class FileTransferService {
  private s3Client: S3Client;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const region = this.config.get('AWS_REGION') ?? 'us-east-1';
    const accessKeyId = this.config.get('AWS_ACCESS_KEY_ID') ?? '';
    const secretAccessKey = this.config.get('AWS_SECRET_ACCESS_KEY') ?? '';
    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async presign(dto: PresignDto, fromUserId: string) {
    const fileKey = `transfers/${uuidv4()}/${dto.fileName}`;

    const putCommand = new PutObjectCommand({
      Bucket: this.config.get('S3_BUCKET_NAME'),
      Key: fileKey,
      ContentType: dto.mimeType,
      ContentLength: dto.size,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, putCommand, { expiresIn: 3600 });

    const transfer = await this.prisma.fileTransfer.create({
      data: {
        fileName: dto.fileName,
        size: dto.size,
        mimeType: dto.mimeType,
        fromUserId,
        toUserId: dto.toUserId,
        status: 'pending',
        fileKey,
      },
    });

    // Validate with Zod
    FileTransferSchema.parse(transfer);

    return { uploadUrl, transferId: transfer.id };
  }

  async getTransfers(userId: string) {
    const transfers = await this.prisma.fileTransfer.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
    });

    // Validate each with Zod
    transfers.forEach(t => FileTransferSchema.parse(t));

    return transfers;
  }

  async accept(id: string, userId: string, dto: AcceptDto) {
    const transfer = await this.prisma.fileTransfer.findUnique({ where: { id } });

    if (!transfer) throw new NotFoundException('Transfer not found');
    if (transfer.toUserId !== userId) throw new BadRequestException('Unauthorized');
    if (transfer.status !== 'pending') throw new BadRequestException('Invalid status');

    const getCommand = new GetObjectCommand({
      Bucket: this.config.get('S3_BUCKET_NAME'),
      Key: transfer.fileKey,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });

    await this.prisma.fileTransfer.update({
      where: { id },
      data: { status: 'accepted' },
    });

    return { downloadUrl };
  }

  async decline(id: string, userId: string, dto: DeclineDto) {
    const transfer = await this.prisma.fileTransfer.findUnique({ where: { id } });

    if (!transfer) throw new NotFoundException('Transfer not found');
    if (transfer.toUserId !== userId) throw new BadRequestException('Unauthorized');
    if (transfer.status !== 'pending') throw new BadRequestException('Invalid status');

    await this.prisma.fileTransfer.update({
      where: { id },
      data: { status: 'declined' },
    });

    return { message: 'Transfer declined' };
  }

  async download(id: string, userId: string) {
    const transfer = await this.prisma.fileTransfer.findUnique({ where: { id } });

    if (!transfer) throw new NotFoundException('Transfer not found');
    if (transfer.toUserId !== userId) throw new BadRequestException('Unauthorized');
    if (transfer.status !== 'accepted') throw new BadRequestException('Not accepted');

    const getCommand = new GetObjectCommand({
      Bucket: this.config.get('S3_BUCKET_NAME'),
      Key: transfer.fileKey,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });

    return { downloadUrl };
  }
} 