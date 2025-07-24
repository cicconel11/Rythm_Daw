import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PresignDto, AcceptDto, DeclineDto } from './dto';
export declare class FileTransferService {
    private prisma;
    private config;
    private s3Client;
    constructor(prisma: PrismaService, config: ConfigService);
    presign(dto: PresignDto, fromUserId: string): Promise<{
        uploadUrl: string;
        transferId: any;
    }>;
    getTransfers(userId: string): Promise<any>;
    accept(id: string, userId: string, dto: AcceptDto): Promise<{
        downloadUrl: string;
    }>;
    decline(id: string, userId: string, dto: DeclineDto): Promise<{
        message: string;
    }>;
    download(id: string, userId: string): Promise<{
        downloadUrl: string;
    }>;
}
