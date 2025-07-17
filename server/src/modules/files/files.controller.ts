import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FileMetaDto } from './dto/file-meta.dto';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presign')
  async create(@Body() dto: FileMetaDto, @CurrentUser() user: User) {
    console.log('FilesController.create - input:', { dto, userId: user?.id });
    const result = await this.filesService.getPresignedPair(dto, user);
    console.log('FilesController.create - result:', result);
    return result;
  }

  // Add this for backward compatibility with tests
  @Post()
  async uploadFile(@Body() dto: FileMetaDto, @CurrentUser() user: User) {
    return this.filesService.getPresignedPair(dto, user);
  }
}
