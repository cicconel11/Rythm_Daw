import { PrismaService } from '../../prisma/prisma.service';
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        data: string;
        projectId: string;
    }>;
    getProjectSnapshots(projectId: string, userId: string): Promise<{
        files: {
            downloadUrl: string;
            path: string;
        }[];
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isPublic: boolean;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        data: string;
        projectId: string;
    }[]>;
    getSnapshotById(projectId: string, snapshotId: string, userId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        data: string;
        projectId: string;
    }>;
    private generateFileHash;
    private generateDownloadUrl;
    private uploadToS3;
    private streamToBuffer;
}
