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
        tag: true,
      },
    });

    const existingTagNames = new Set(existingTags.map((et) => et.tag.name));
    const newTagNames = normalizedTags.filter((name) => !existingTagNames.has(name));

    // Remove tags that are no longer present
    const tagsToRemove = existingTags.filter((et) => !normalizedTags.includes(et.tag.name));

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

    // Create entity-tag relationships for new tags
    await this.prisma.$transaction([
      // Remove old tags
      ...(tagsToRemove.length > 0
        ? [
            this.prisma.entityTag.deleteMany({
              where: {
                id: { in: tagsToRemove.map((t) => t.id) },
              },
            }),
          ]
        : []),

      // Add new tags
      ...(newTags.length > 0
        ? [
            this.prisma.entityTag.createMany({
              data: newTags.map((tag) => ({
                entityType,
                entityId,
                tagId: tag.id,
                createdById: userId,
              })),
              skipDuplicates: true,
            }),
          ]
        : []),
    ]);

    // Return all tags for the entity after update
    return this.getEntityTags(entityType, entityId);
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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return entityTags.map((et) => ({
      id: et.tag.id,
      name: et.tag.name,
      color: et.tag.color,
      createdAt: et.createdAt,
      createdBy: et.createdBy,
    }));
  }

  /**
   * Get all tags with counts
   * @param entityType Optional filter by entity type
   * @returns Array of tags with their usage counts
   */
  async getAllTags(entityType?: string) {
    const where: Prisma.EntityTagWhereInput = {};
    if (entityType) {
      where.entityType = entityType;
    }

    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            entities: {
              where,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      count: tag._count.entities,
      createdAt: tag.createdAt,
    }));
  }

  /**
   * Find entities by tags
   * @param entityType Type of entities to find
   * @param tags Array of tag names to filter by
   * @returns Array of entity IDs that have all the specified tags
   */
  async findEntitiesByTags(entityType: string, tags: string[]) {
    if (!tags.length) return [];

    const result = await this.prisma.$queryRaw`
      SELECT "entityId"
      FROM "EntityTag" et
      JOIN "Tag" t ON et."tagId" = t.id
      WHERE et."entityType" = ${entityType}
      AND t.name IN (${Prisma.join(tags)})
      GROUP BY "entityId"
      HAVING COUNT(DISTINCT t.name) = ${tags.length}
    `;

    return result.map((r: any) => r.entityId);
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
        _count: {
          select: { entities: true },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    if (tag._count.entities > 0 && !force) {
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
