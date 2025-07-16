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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const common_1 = require("@nestjs/common");
const AWS = __importStar(require("aws-sdk"));
const config_1 = require("@nestjs/config");
AWS.config.update({
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'MOCK_ACCESS_KEY',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'MOCK_SECRET_KEY',
    ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? {
        s3ForcePathStyle: true,
        endpoint: 'http://localhost:4566'
    } : {})
});
let AwsS3Service = class AwsS3Service {
    constructor(configService) {
        this.configService = configService;
        const bucketName = this.configService.get('S3_BUCKET');
        if (process.env.NODE_ENV === 'production') {
            const region = this.configService.get('AWS_REGION');
            const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
            const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
            if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
                throw new Error('Missing required AWS configuration for production');
            }
        }
        else {
            console.warn('Running with mock S3 client - file operations will not persist');
        }
        this.s3 = new AWS.S3();
        this.bucketName = bucketName || 'rhythm-dev';
    }
    async getPresignedPair(key, contentType, contentLength) {
        const params = {
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
            ContentLength: contentLength,
            Expires: 3600,
        };
        try {
            const [uploadUrl, downloadUrl] = await Promise.all([
                this.s3.getSignedUrlPromise('putObject', params),
                this.s3.getSignedUrlPromise('getObject', {
                    Bucket: this.bucketName,
                    Key: key,
                    Expires: 86400,
                }),
            ]);
            return {
                uploadUrl,
                downloadUrl,
            };
        }
        catch (error) {
            console.error('Error generating presigned URLs:', error);
            throw new Error('Failed to generate presigned URLs');
        }
    }
};
exports.AwsS3Service = AwsS3Service;
exports.AwsS3Service = AwsS3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsS3Service);
//# sourceMappingURL=aws-s3.service.js.map