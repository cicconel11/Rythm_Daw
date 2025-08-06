import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTagsDto } from './dto/update-tags.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Update tags for an entity
   * @param entityType Type of the entity (e.g., 'project', 'file', 'snapshot')
   * @param entityId ID of the entity
   * @param userId ID of the user performing the update
   * @param dto UpdateTagsDto containing tag names and optional default color
   * @returns The updated tags for the entity
   */
  async updateEntityTags(
    entityType: string,
    entityId: string,
    userId: string,
    dto: UpdateTagsDto,
  ) {
    const { tags: tagNames, defaultColor = '#6B7280' } = dto;

    // Normalize tag names (trim, lowercase, etc.)
    const normalizedTags = tagNames
      .map((name) => name.trim().toLowerCase())
      .filter((name) => name.length > 0);

    // Get existing tags for this entity
    const existingTags = await this.prisma.entityTag.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        tag: {
          include: {
            _count: {
              select: { entityTags: true }
            }
          }
        },
      },
    });

    const existingTagNames = new Set(existingTags.map((et: unknown) => (et as { tag: { name: string } }).tag.name));
    const newTagNames = normalizedTags.filter((name) => !existingTagNames.has(name));

    // Remove tags that are no longer present
    const tagsToRemove = existingTags.filter((et: unknown) => !normalizedTags.includes((et as { tag: { name: string } }).tag.name));

    // Create any new tags that don't exist
    const newTags = await Promise.all(
      newTagNames.map((name) =>
        this.prisma.tag.upsert({
          where: { name },
          create: {
            name,
            color: defaultColor,
          },
          update: {},
        }),
      ),
    );

    // Use a transaction to ensure data consistency
    await this.prisma.$transaction(async (prisma: any) => {
      // Remove old tags that are not in the new list
      if (tagsToRemove.length > 0) {
        await (prisma as any).entityTag.deleteMany({
          where: {
            entityType,
            entityId,
            tagId: { in: tagsToRemove.map((t: unknown) => (t as { id: string }).id) },
          },
        });
      }

      // Add new tags
      if (newTags.length > 0) {
        // First, find existing entity tags to avoid duplicates
        const existingEntityTags = await (prisma as any).entityTag.findMany({
          where: {
            entityType,
            entityId,
            tagId: { in: newTags.map((tag: any) => tag.id) },
          },
          select: { tagId: true },
        });

        const existingTagIds = new Set(existingEntityTags.map((et: unknown) => (et as { tagId: string }).tagId));
        const tagsToCreate = newTags.filter((tag: any) => !existingTagIds.has(tag.id));

        if (tagsToCreate.length > 0) {
          await (prisma as any).entityTag.createMany({
            data: tagsToCreate.map((tag: any) => ({
              entityType,
              entityId,
              tagId: tag.id,
              createdById: userId,
            })),
          });
        }
      }
    });

    // Return all tags for the entity after update
    const result = await Promise.all(
      existingTags.map(async (et: unknown) => {
        const tag = await this.prisma.tag.findUnique({
          where: { id: (et as { tagId: string }).tagId },
        });
        
        if (!tag) {
          throw new NotFoundException(`Tag with ID ${(et as { tagId: string }).tagId} not found`);
        }
        
        return {
          id: tag.id,
          name: tag.name,
          color: tag.color,
          createdAt: (et as { createdAt: Date }).createdAt,
        };
      })
    );

    const newTagResults = await Promise.all(
      newTags.map(async (tag: any) => {
        const entityTag = await this.prisma.entityTag.create({
          data: {
            entityType,
            entityId,
            tagId: tag.id,
          },
          include: {
            tag: true,
          },
        });

        return {
          id: entityTag.tag.id,
          name: entityTag.tag.name,
          color: entityTag.tag.color,
          createdAt: entityTag.createdAt,
        };
      }),
    );

    return [...result, ...newTagResults];
  }

  /**
   * Get all tags for an entity
   * @param entityType Type of the entity
   * @param entityId ID of the entity
   * @returns Array of tags with their details
   */
  async getEntityTags(entityType: string, entityId: string) {
    const entityTags = await this.prisma.entityTag.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        tag: true,
      },
    });

    return entityTags.map((et: unknown) => ({
      id: (et as { tag: { id: string } }).tag.id,
      name: (et as { tag: { name: string } }).tag.name,
      color: (et as { tag: { color: string } }).tag.color,
      createdAt: (et as { tag: { createdAt: Date } }).tag.createdAt,
    }));
  }

  /**
   * Get all tags with counts
   * @param filter Optional filter by search and limit
   * @returns Array of tags with their usage counts
   */
  async findAll(filter?: { search?: string; limit?: number }) {
    const where: unknown = {}; // Using unknown to avoid Prisma type issues
    
    if (filter?.search) {
      (where as Record<string, unknown>).OR = [
        { name: { contains: filter.search } },
        { name: { contains: filter.search.toLowerCase() } },
        { name: { contains: filter.search.toUpperCase() } },
      ];
    }
    
    const tags = await this.prisma.tag.findMany({
      where: (where as any),
      include: {
        _count: {
          select: { entityTags: true },
        },
      },
      take: filter?.limit,
    });
    
    return tags.map((tag: unknown) => ({
      id: (tag as { id: string }).id,
      name: (tag as { name: string }).name,
      description: (tag as { description: string }).description,
      color: (tag as { color: string }).color,
      count: (tag as { _count: { entityTags: number } })._count.entityTags,
    }));
  }

  /**
   * Find entities by tags
   * @param entityType Type of entities to find
   * @param tags Array of tag names to filter by
   * @returns Array of entity IDs that have all the specified tags
   */
  async findEntitiesByTags(entityType: string, tags: string[]): Promise<string[]> {
    if (!tags.length) return [];

    interface QueryResult {
      entityId: string;
    }

    // Convert tags to a comma-separated string with proper escaping
    const tagsList = tags.map(tag => `'${tag.replace(/'/g, "''")}'`).join(',');
    
    const query = `
      SELECT "entityId"
      FROM "EntityTag" et
      JOIN "Tag" t ON et."tagId" = t.id
      WHERE et."entityType" = $1
      AND t.name IN (${tagsList})
      GROUP BY "entityId"
      HAVING COUNT(DISTINCT t.name) = $2
    `;

    const result = await this.prisma.$queryRawUnsafe(query, entityType, tags.length) as QueryResult[];
    return result.map(r => r.entityId);
  }

  /**
   * Delete a tag by ID
   * @param tagId ID of the tag to delete
   * @param force If true, will delete the tag even if it's in use
   */
  async deleteTag(tagId: string, force = false) {
    const tag = await this.prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        _count: { select: { entityTags: true } },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    if (tag._count.entityTags > 0 && !force) {
      throw new BadRequestException(
        `Cannot delete tag '${tag.name}' as it's still in use. Use force=true to delete anyway.`,
      );
    }

    await this.prisma.$transaction([
      this.prisma.entityTag.deleteMany({
        where: { tagId },
      }),
      this.prisma.tag.delete({
        where: { id: tagId },
      }),
    ]);
  }
}
