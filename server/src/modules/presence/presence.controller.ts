import { Controller, Post, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { PresenceService } from './presence.service';
import type { RequestWithUser } from '../../constants/request-with-user';

@ApiTags('presence')
@Controller('presence')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post('heartbeat')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update user presence status' })
  @ApiResponse({ status: 204, description: 'Presence updated' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async heartbeat(
    @Req() req: RequestWithUser,
    @Body() dto: HeartbeatDto,
  ) {
    const userId = req.user.userId; // Set by JwtAuthGuard
    await this.presenceService.updateHeartbeat(userId, dto);
  }
}
