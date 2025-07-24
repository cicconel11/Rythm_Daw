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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTransferService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const types_1 = require("../../../../shared/types");
let FileTransferService = class FileTransferService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        const region = this.config.get('AWS_REGION') ?? 'us-east-1';
        const accessKeyId = this.config.get('AWS_ACCESS_KEY_ID') ?? '';
        const secretAccessKey = this.config.get('AWS_SECRET_ACCESS_KEY') ?? '';
        this.s3Client = new client_s3_1.S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }
    async presign(dto, fromUserId) {
        const fileKey = `transfers/${(0, uuid_1.v4)()}/${dto.fileName}`;
        const putCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.config.get('S3_BUCKET_NAME'),
            Key: fileKey,
            ContentType: dto.mimeType,
            ContentLength: dto.size,
        });
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, putCommand, { expiresIn: 3600 });
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
        types_1.FileTransferSchema.parse(transfer);
        return { uploadUrl, transferId: transfer.id };
    }
    async getTransfers(userId) {
        const transfers = await this.prisma.fileTransfer.findMany({
            where: {
                OR: [{ fromUserId: userId }, { toUserId: userId }],
            },
        });
        transfers.forEach(t => types_1.FileTransferSchema.parse(t));
        return transfers;
    }
    async accept(id, userId, dto) {
        const transfer = await this.prisma.fileTransfer.findUnique({ where: { id } });
        if (!transfer)
            throw new common_1.NotFoundException('Transfer not found');
        if (transfer.toUserId !== userId)
            throw new common_1.BadRequestException('Unauthorized');
        if (transfer.status !== 'pending')
            throw new common_1.BadRequestException('Invalid status');
        const getCommand = new client_s3_1.GetObjectCommand({
            Bucket: this.config.get('S3_BUCKET_NAME'),
            Key: transfer.fileKey,
        });
        const downloadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getCommand, { expiresIn: 3600 });
        await this.prisma.fileTransfer.update({
            where: { id },
            data: { status: 'accepted' },
        });
        return { downloadUrl };
    }
    async decline(id, userId, dto) {
        const transfer = await this.prisma.fileTransfer.findUnique({ where: { id } });
        if (!transfer)
            throw new common_1.NotFoundException('Transfer not found');
        if (transfer.toUserId !== userId)
            throw new common_1.BadRequestException('Unauthorized');
        if (transfer.status !== 'pending')
            throw new common_1.BadRequestException('Invalid status');
        await this.prisma.fileTransfer.update({
            where: { id },
            data: { status: 'declined' },
        });
        return { message: 'Transfer declined' };
    }
    async download(id, userId) {
        const transfer = await this.prisma.fileTransfer.findUnique({ where: { id } });
        if (!transfer)
            throw new common_1.NotFoundException('Transfer not found');
        if (transfer.toUserId !== userId)
            throw new common_1.BadRequestException('Unauthorized');
        if (transfer.status !== 'accepted')
            throw new common_1.BadRequestException('Not accepted');
        const getCommand = new client_s3_1.GetObjectCommand({
            Bucket: this.config.get('S3_BUCKET_NAME'),
            Key: transfer.fileKey,
        });
        const downloadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getCommand, { expiresIn: 3600 });
        return { downloadUrl };
    }
};
exports.FileTransferService = FileTransferService;
exports.FileTransferService = FileTransferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], FileTransferService);
//# sourceMappingURL=file-transfer.service.js.map