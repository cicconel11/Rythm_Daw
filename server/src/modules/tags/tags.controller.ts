import { Controller, Put, Param, Body, UseGuards, Get, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import type { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { TagsService } from './tags.service';
import { UpdateTagsDto } from './dto/update-tags.dto';
// Local interface for Tag based on Prisma schema
interface Tag {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  entityTags: Array<{
    id: string;
    entityType: string;
    entityId: string;
    tagId: string;
    snapshotId: string | null;
    createdAt: Date;
  }>;
}

@ApiTags('tags')
@Controller('api/tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Put(':entityType/:entityId')
  @ApiOperation({ summary: 'Update tags for an entity' })
  @ApiParam({ name: 'entityType', description: 'Type of the entity (e.g., project, file, snapshot)' })
  @ApiParam({ name: 'entityId', description: 'ID of the entity' })
  @ApiResponse({ status: 200, description: 'Tags updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateEntityTags(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @GetUser() user: JwtPayload,
    @Body() updateTagsDto: UpdateTagsDto,
  ) {
    return this.tagsService.updateEntityTags(
      entityType,
      entityId,
      user.sub,
      updateTagsDto,
    );
  }

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Get tags for an entity' })
  @ApiParam({ name: 'entityType', description: 'Type of the entity' })
  @ApiParam({ name: 'entityId', description: 'ID of the entity' })
  @ApiResponse({ status: 200, description: 'Returns the tags for the entity' })
  @ApiResponse({ status: 404, description: 'Entity not found' })
  getEntityTags(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.tagsService.getEntityTags(entityType, entityId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags with counts' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term for tag names' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit the number of results' })
  @ApiResponse({ status: 200, description: 'Returns all tags with their usage counts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: number
  ) {
    return this.tagsService.findAll({
      search,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Delete(':tagId')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'tagId', description: 'ID of the tag to delete' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete tag in use' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  deleteTag(
    @Param('tagId') tagId: string,
    @Query('force') force: boolean = false,
  ) {
    return this.tagsService.deleteTag(tagId, force);
  }
}
