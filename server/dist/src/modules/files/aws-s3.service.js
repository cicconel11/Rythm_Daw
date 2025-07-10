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
exports.AwsS3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@nestjs/config");
let AwsS3Service = class AwsS3Service {
    constructor(configService) {
        this.configService = configService;
        const region = this.configService.get('AWS_REGION');
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const bucketName = this.configService.get('S3_BUCKET');
        if (process.env.NODE_ENV === 'test') {
            this.s3Client = new client_s3_1.S3Client({
                region: region ?? 'us-east-1',
                credentials: { accessKeyId: 'TEST', secretAccessKey: 'TEST' },
            });
            this.bucketName = bucketName ?? 'rhythm-test';
            return;
        }
        if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
            throw new Error('Missing required AWS configuration');
        }
        this.s3Client = new client_s3_1.S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
        this.bucketName = bucketName;
    }
    async getPresignedPair(key, contentType, contentLength) {
        const putCommand = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
            ContentLength: contentLength,
        });
        const getCommand = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        const [putUrl, getUrl] = await Promise.all([
            (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, putCommand, { expiresIn: 3600 }),
            (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getCommand, { expiresIn: 86400 * 7 }),
        ]);
        return { putUrl, getUrl };
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map