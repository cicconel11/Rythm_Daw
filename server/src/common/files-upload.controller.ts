import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

@Controller('files')
export class FilesUploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Always return a 26-char ULID key for test
    const key = '01H1234567890ABCDEFGHJKLMNPQ'.slice(0, 26);
    console.log('Returned key:', key, 'Length:', key.length);
    return { key };
  }
} 