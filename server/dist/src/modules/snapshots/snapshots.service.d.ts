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
        projectId: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        data: Prisma.JsonValue;
    }>;
    getProjectSnapshots(projectId: string, userId: string): Promise<{
        files: {
            downloadUrl: string;
            path: string;
        }[];
        project: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isPublic: boolean;
        };
        projectId: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        data: Prisma.JsonValue;
    }[]>;
    getSnapshotById(projectId: string, snapshotId: string, userId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        projectId: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        data: Prisma.JsonValue;
    }>;
    private generateFileHash;
    private generateDownloadUrl;
    private uploadToS3;
    private streamToBuffer;
}
