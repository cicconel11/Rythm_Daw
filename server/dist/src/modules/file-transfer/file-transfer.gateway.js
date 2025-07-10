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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FileTransferGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTransferGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const ws_1 = require("ws");
const common_1 = require("@nestjs/common");
const jwt_ws_auth_guard_1 = require("../auth/guards/jwt-ws-auth.guard");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@nestjs/config");
let FileTransferGateway = FileTransferGateway_1 = class FileTransferGateway {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(FileTransferGateway_1.name);
        this.clients = new Map();
        this.stunServers = [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
        ];
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }
    async handleConnection(client) {
        client.id = Math.random().toString(36).substring(2, 15);
        client.isAlive = true;
        this.clients.set(client.id, client);
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.clients.delete(client.id);
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleInitTransfer(client, data) {
        try {
            const fileKey = `uploads/${Date.now()}-${data.fileName}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.configService.get('S3_BUCKET_NAME'),
                Key: fileKey,
                ContentType: data.mimeType,
                ContentLength: data.fileSize,
            });
            const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
            return {
                event: 'transfer-initiated',
                data: {
                    uploadUrl,
                    fileKey,
                    stunServers: this.stunServers,
                },
            };
        }
        catch (error) {
            this.logger.error('Error initializing file transfer:', error);
            return {
                event: 'transfer-error',
                data: { message: 'Failed to initialize file transfer' },
            };
        }
    }
    async handleOffer(client, data) {
        const targetClient = Array.from(this.clients.values()).find(c => c.userId === data.to);
        if (targetClient) {
            targetClient.send(JSON.stringify({
                event: 'offer',
                data: {
                    from: client.userId,
                    offer: data.offer,
                },
            }));
        }
    }
    async handleAnswer(client, data) {
        const targetClient = Array.from(this.clients.values()).find(c => c.userId === data.to);
        if (targetClient) {
            targetClient.send(JSON.stringify({
                event: 'answer',
                data: {
                    from: client.userId,
                    answer: data.answer,
                },
            }));
        }
    }
    async handleIceCandidate(client, data) {
        const targetClient = Array.from(this.clients.values()).find(c => c.userId === data.to);
        if (targetClient) {
            targetClient.send(JSON.stringify({
                event: 'ice-candidate',
                data: {
                    from: client.userId,
                    candidate: data.candidate,
                },
            }));
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", ws_1.Server)
], FileTransferGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard),
    (0, websockets_1.SubscribeMessage)('init-transfer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileTransferGateway.prototype, "handleInitTransfer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard),
    (0, websockets_1.SubscribeMessage)('offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileTransferGateway.prototype, "handleOffer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard),
    (0, websockets_1.SubscribeMessage)('answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileTransferGateway.prototype, "handleAnswer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_ws_auth_guard_1.JwtWsAuthGuard),
    (0, websockets_1.SubscribeMessage)('ice-candidate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileTransferGateway.prototype, "handleIceCandidate", null);
FileTransferGateway = FileTransferGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        path: '/ws/file-transfer',
        cors: {
            origin: process.env.NODE_ENV === 'production'
                ? ['https://your-production-domain.com']
                : ['http://localhost:3000'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileTransferGateway);
exports.FileTransferGateway = FileTransferGateway;
//# sourceMappingURL=file-transfer.gateway.js.map