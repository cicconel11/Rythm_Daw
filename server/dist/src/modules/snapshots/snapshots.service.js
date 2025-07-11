"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SnapshotsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const crypto = __importStar(require("crypto"));
let SnapshotsService = SnapshotsService_1 = class SnapshotsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(SnapshotsService_1.name);
        this.presignedUrlExpiration = 3600;
        const awsRegion = this.configService.get('AWS_REGION');
        const awsAccessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const awsSecretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
            throw new Error('AWS configuration is missing. Please set AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY environment variables.');
        }
        this.s3Client = new client_s3_1.S3Client({
            region: awsRegion,
            credentials: {
                accessKeyId: awsAccessKeyId,
                secretAccessKey: awsSecretAccessKey,
            },
        });
        this.bucketName = this.configService.get('S3_SNAPSHOTS_BUCKET') || 'rhythm-snapshots';
    }
    async createSnapshot(userId, dto, file) {
        const { projectId, ...snapshotData } = dto;
        const snapshotId = (0, uuid_1.v4)();
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!project.isPublic) {
            throw new common_1.BadRequestException('This project is not public');
        }
        let fileMetadata = [];
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
    async getProjectSnapshots(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!project.isPublic) {
            throw new common_1.BadRequestException('This project is not public');
        }
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
        const snapshotsWithUrls = await Promise.all(snapshots.map(async (snapshot) => {
            const files = [];
            try {
                const snapshotData = snapshot.data;
                if (snapshotData?.files?.length) {
                    files.push(...await Promise.all(snapshotData.files.map(async (file) => ({
                        ...file,
                        downloadUrl: await this.generateDownloadUrl(projectId, snapshot.id, file.path),
                    }))));
                }
            }
            catch (error) {
                this.logger.error('Error processing snapshot files', error);
            }
            return {
                ...snapshot,
                files,
            };
        }));
        return snapshotsWithUrls;
    }
    async getSnapshotById(projectId, snapshotId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (!project.isPublic) {
            throw new common_1.BadRequestException('This project is not public');
        }
        const snapshot = await this.prisma.snapshot.findUnique({
            where: { id: snapshotId, projectId },
        });
        if (!snapshot) {
            throw new common_1.NotFoundException('Snapshot not found');
        }
        let files = [];
        try {
            const snapshotData = snapshot.data;
            if (snapshotData?.files?.length) {
                files = await Promise.all(snapshotData.files.map(async (file) => ({
                    ...file,
                    downloadUrl: await this.generateDownloadUrl(projectId, snapshotId, file.path),
                })));
            }
        }
        catch (error) {
            this.logger.error('Error processing snapshot files', error);
        }
        return {
            ...snapshot,
            files,
        };
    }
    generateFileHash(buffer) {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }
    async generateDownloadUrl(projectId, snapshotId, filePath) {
        try {
            const fileKey = `snapshots/${projectId}/${snapshotId}/${filePath}`;
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey,
            });
            return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: this.presignedUrlExpiration });
        }
        catch (error) {
            this.logger.error(`Error generating download URL for ${filePath}`, error);
            throw new common_1.InternalServerErrorException('Failed to generate download URL');
        }
    }
    async uploadToS3(buffer, key, contentType) {
        try {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            });
            await this.s3Client.send(command);
            return key;
        }
        catch (error) {
            this.logger.error('Error uploading to S3', error);
            throw new common_1.InternalServerErrorException('Failed to upload file');
        }
    }
    async streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }
};
exports.SnapshotsService = SnapshotsService;
exports.SnapshotsService = SnapshotsService = SnapshotsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SnapshotsService);
//# sourceMappingURL=snapshots.service.js.map