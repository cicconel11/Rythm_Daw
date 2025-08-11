import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService implements OnModuleInit {
  private readonly logger = new Logger(EncryptionService.name);
  private encryptionKey!: Buffer;
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly IV_LENGTH = 12; // For GCM, 12 bytes is recommended
  private readonly AUTH_TAG_LENGTH = 16; // 16 bytes for GCM

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Get encryption key from environment or generate a secure one
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key) {
      this.logger.warn('ENCRYPTION_KEY not set, using a random key (not suitable for production)');
      this.encryptionKey = crypto.randomBytes(32); // 256 bits for AES-256
    } else {
      // Derive a consistent key from the provided secret
      this.encryptionKey = crypto
        .createHash('sha256')
        .update(key)
        .digest();
    }
  }

  /**
   * Encrypts a string using AES-256-GCM
   */
  encrypt(text: unknown): unknown {
    if (!text) return text;
    
    try {
      const iv = crypto.randomBytes(this.IV_LENGTH);
      const cipher = crypto.createCipheriv(
        this.ALGORITHM,
        this.encryptionKey,
        iv,
        { authTagLength: this.AUTH_TAG_LENGTH }
      );
      
      let encrypted = cipher.update(text as string, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      const authTag = cipher.getAuthTag();
      
      // Combine IV + authTag + encrypted data
      const result = Buffer.concat([
        iv,
        authTag,
        Buffer.from(encrypted, 'base64')
      ]);
      
      return result.toString('base64');
    } catch (error) {
      this.logger.error('Encryption failed', (error as unknown as Error).stack);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts a string encrypted with AES-256-GCM
   */
  decrypt(encryptedText: unknown): string | null {
    if (!encryptedText) return null;
    
    try {
      const data = Buffer.from(encryptedText as string, 'base64');
      
      // Extract IV (first 12 bytes)
      const iv = data.subarray(0, this.IV_LENGTH);
      
      // Extract auth tag (next 16 bytes)
      const authTag = data.subarray(this.IV_LENGTH, this.IV_LENGTH + this.AUTH_TAG_LENGTH);
      
      // Extract encrypted data (the rest)
      const encrypted = data.subarray(this.IV_LENGTH + this.AUTH_TAG_LENGTH);
      
      const decipher = crypto.createDecipheriv(
        this.ALGORITHM,
        this.encryptionKey,
        iv,
        { authTagLength: this.AUTH_TAG_LENGTH }
      );
      
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', (error as unknown as Error).stack);
      throw new Error('Failed to decrypt data - it may be corrupted or tampered with');
    }
  }

  /**
   * Encrypts an object by converting it to JSON first
   */
  encryptObject<T extends object>(obj: T | null): string | null {
    if (!obj) return null;
    return this.encrypt(JSON.stringify(obj)) as string;
  }

  /**
   * Decrypts and parses an encrypted JSON object
   */
  decryptObject<T>(encrypted: string | null): T | null {
    if (!encrypted) return null;
    const decrypted = this.decrypt(encrypted);
    if (typeof decrypted !== 'string') return null;
    return JSON.parse(decrypted) as T;
  }
}
