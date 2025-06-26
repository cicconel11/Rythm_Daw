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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EncryptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
let EncryptionService = EncryptionService_1 = class EncryptionService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EncryptionService_1.name);
        this.ALGORITHM = 'aes-256-gcm';
        this.IV_LENGTH = 12;
        this.AUTH_TAG_LENGTH = 16;
    }
    onModuleInit() {
        const key = this.configService.get('ENCRYPTION_KEY');
        if (!key) {
            this.logger.warn('ENCRYPTION_KEY not set, using a random key (not suitable for production)');
            this.encryptionKey = crypto.randomBytes(32);
        }
        else {
            this.encryptionKey = crypto
                .createHash('sha256')
                .update(key)
                .digest();
        }
    }
    encrypt(text) {
        if (!text)
            return text;
        try {
            const iv = crypto.randomBytes(this.IV_LENGTH);
            const cipher = crypto.createCipheriv(this.ALGORITHM, this.encryptionKey, iv, { authTagLength: this.AUTH_TAG_LENGTH });
            let encrypted = cipher.update(text, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            const authTag = cipher.getAuthTag();
            const result = Buffer.concat([
                iv,
                authTag,
                Buffer.from(encrypted, 'base64')
            ]);
            return result.toString('base64');
        }
        catch (error) {
            this.logger.error('Encryption failed', error.stack);
            throw new Error('Failed to encrypt data');
        }
    }
    decrypt(encryptedText) {
        if (!encryptedText)
            return encryptedText;
        try {
            const data = Buffer.from(encryptedText, 'base64');
            const iv = data.subarray(0, this.IV_LENGTH);
            const authTag = data.subarray(this.IV_LENGTH, this.IV_LENGTH + this.AUTH_TAG_LENGTH);
            const encrypted = data.subarray(this.IV_LENGTH + this.AUTH_TAG_LENGTH);
            const decipher = crypto.createDecipheriv(this.ALGORITHM, this.encryptionKey, iv, { authTagLength: this.AUTH_TAG_LENGTH });
            decipher.setAuthTag(authTag);
            let decrypted = decipher.update(encrypted, undefined, 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (error) {
            this.logger.error('Decryption failed', error.stack);
            throw new Error('Failed to decrypt data - it may be corrupted or tampered with');
        }
    }
    encryptObject(obj) {
        if (!obj)
            return null;
        return this.encrypt(JSON.stringify(obj));
    }
    decryptObject(encrypted) {
        if (!encrypted)
            return null;
        return JSON.parse(this.decrypt(encrypted));
    }
};
EncryptionService = EncryptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionService);
exports.EncryptionService = EncryptionService;
//# sourceMappingURL=encryption.service.js.map