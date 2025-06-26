import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class EncryptionService implements OnModuleInit {
    private configService;
    private readonly logger;
    private encryptionKey;
    private readonly ALGORITHM;
    private readonly IV_LENGTH;
    private readonly AUTH_TAG_LENGTH;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    encrypt(text: string): string;
    decrypt(encryptedText: string): string;
    encryptObject<T extends object>(obj: T): string;
    decryptObject<T extends object>(encrypted: string): T;
}
