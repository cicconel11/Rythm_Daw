import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FileTransferService } from './file-transfer.service';
import { PresignDto, AcceptDto, DeclineDto } from './dto';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileTransferController {
  constructor(private readonly service: FileTransferService) {}

  @Post('presign')
  async presign(@Body() dto: PresignDto, @CurrentUser() user: User) {
    return this.service.presign(dto, user.id);
  }

  @Get('transfers')
  async getTransfers(@CurrentUser() user: User) {
    return this.service.getTransfers(user.id);
  }

  @Post(':id/accept')
  async accept(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: AcceptDto,
  ) {
    return this.service.accept(id, user.id, dto);
  }

  @Post(':id/decline')
  async decline(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: DeclineDto,
  ) {
    return this.service.decline(id, user.id, dto);
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @CurrentUser() user: User) {
    return this.service.download(id, user.id);
  }
}