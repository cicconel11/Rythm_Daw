import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
export declare class SnapshotsService {
    private prisma;
    private configService;
    private readonly logger;
    private readonly s3Client;
    private readonly bucketName;
    private readonly presignedUrlExpiration;
    constructor(prisma: PrismaService, configService: ConfigService);
    createSnapshot(userId: string, dto: CreateSnapshotDto, file?: Express.Multer.File): Promise<{
        name: string;
        data: Prisma.JsonValue;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    getProjectSnapshots(projectId: string, userId: string): Promise<{
        files: {
            downloadUrl: string;
            path: string;
        }[];
        project: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isPublic: boolean;
        };
        name: string;
        data: Prisma.JsonValue;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }[]>;
    getSnapshotById(projectId: string, snapshotId: string, userId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        name: string;
        data: Prisma.JsonValue;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    private generateFileHash;
    private generateDownloadUrl;
    private uploadToS3;
    private streamToBuffer;
}
