import { Controller, Post, Get, Body, Param, UploadedFile, UseInterceptors, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';
import { SnapshotsService } from './snapshots.service';
import type { RequestWithUser } from '../../constants/request-with-user';

@ApiTags('snapshots')
@Controller('api/snapshots')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project snapshot' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      required: ['projectId', 'name'] as string[],
      properties: {
        projectId: { 
          type: 'string',
          format: 'uuid',
          description: 'ID of the project this snapshot belongs to'
        },
        name: { 
          type: 'string',
          description: 'Name of the snapshot'
        },
        description: { 
          type: 'string',
          description: 'Optional description of the snapshot',
          nullable: true
        },
        metadata: { 
          type: 'string',
          description: 'JSON string of metadata',
          nullable: true
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'ZIP file containing project files (optional)',
          nullable: true
        },
      },
    }
  })
  @ApiResponse({ status: 201, description: 'Snapshot created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async create(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() createSnapshotDto: unknown, // Using unknown to handle multipart form data
  ) {
    // Parse metadata if it's a string
    let metadata = {};
    if (createSnapshotDto.metadata) {
      try {
        metadata = JSON.parse(createSnapshotDto.metadata);
      } catch (e) {
        // If parsing fails, use as is (handles both string and object)
        metadata = createSnapshotDto.metadata;
      }
    }

    const dto: CreateSnapshotDto = {
      projectId: createSnapshotDto.projectId,
      name: createSnapshotDto.name,
      description: createSnapshotDto.description,
      metadata,
    };

    const userId = req.user.userId; // From JWT
    return this.snapshotsService.createSnapshot(userId, dto, file);
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get all snapshots for a project' })
  @ApiResponse({ status: 200, description: 'List of snapshots' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findAll(
    @Req() req: RequestWithUser,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const userId = req.user.userId; // From JWT
    return this.snapshotsService.getProjectSnapshots(projectId, userId);
  }

  @Get(':projectId/:snapshotId')
  @ApiOperation({ summary: 'Get a specific snapshot' })
  @ApiResponse({ status: 200, description: 'Snapshot details' })
  @ApiResponse({ status: 404, description: 'Snapshot not found' })
  async findOne(
    @Req() req: RequestWithUser,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('snapshotId', ParseUUIDPipe) snapshotId: string,
  ) {
    const userId = req.user.userId; // From JWT
    return this.snapshotsService.getSnapshotById(projectId, snapshotId, userId);
  }
}
