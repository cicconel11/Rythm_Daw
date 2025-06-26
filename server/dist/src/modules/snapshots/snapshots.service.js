"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SnapshotsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
let SnapshotsService = SnapshotsService_1 = class SnapshotsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(SnapshotsService_1.name);
        this.presignedUrlExpiration = 3600;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
        this.bucketName = this.configService.get('S3_SNAPSHOTS_BUCKET') || 'rhythm-snapshots';
    }
    async createSnapshot(userId, dto, file) {
        const { projectId, ...snapshotData } = dto;
        const snapshotId = (0, uuid_1.v4)();
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, members: { where: { userId } } },
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        if (project.members.length === 0) {
            throw new common_1.BadRequestException('You do not have permission to create snapshots for this project');
        }
        let fileMetadata = [];
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
    async getProjectSnapshots(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true, members: { where: { userId } } },
        });
        if (!project || project.members.length === 0) {
            throw new common_1.NotFoundException('Project not found or access denied');
        }
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
        const snapshotsWithUrls = await Promise.all(snapshots.map(async (snapshot) => {
            const files = await Promise.all(snapshot.files.map(async (file) => ({
                ...file,
                downloadUrl: await this.generateDownloadUrl(projectId, snapshot.id, file.path),
            })));
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
            select: { id: true, members: { where: { userId } } },
        });
        if (!project || project.members.length === 0) {
            throw new common_1.NotFoundException('Project not found or access denied');
        }
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
            throw new common_1.NotFoundException('Snapshot not found');
        }
        const files = await Promise.all(snapshot.files.map(async (file) => ({
            ...file,
            downloadUrl: await this.generateDownloadUrl(projectId, snapshotId, file.path),
        })));
        return {
            ...snapshot,
            files,
        };
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
    async generateDownloadUrl(projectId, snapshotId, filePath) {
        try {
            const key = `snapshots/${projectId}/${snapshotId}/${filePath}`;
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: this.presignedUrlExpiration });
        }
        catch (error) {
            this.logger.error('Error generating download URL', error);
            return '';
        }
    }
    generateFileHash(buffer) {
        return require('crypto').createHash('sha256').update(buffer).digest('hex');
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
SnapshotsService = SnapshotsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, config_1.ConfigService])
], SnapshotsService);
exports.SnapshotsService = SnapshotsService;
//# sourceMappingURL=snapshots.service.js.map