"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TagsService = class TagsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateEntityTags(entityType, entityId, userId, dto) {
        const { tags: tagNames, defaultColor = '#6B7280' } = dto;
        const normalizedTags = tagNames
            .map((name) => name.trim().toLowerCase())
            .filter((name) => name.length > 0);
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
        const existingTagNames = new Set(existingTags.map((et) => et.tag.name));
        const newTagNames = normalizedTags.filter((name) => !existingTagNames.has(name));
        const tagsToRemove = existingTags.filter((et) => !normalizedTags.includes(et.tag.name));
        const newTags = await Promise.all(newTagNames.map((name) => this.prisma.tag.upsert({
            where: { name },
            create: {
                name,
                color: defaultColor,
            },
            update: {},
        })));
        await this.prisma.$transaction(async (prisma) => {
            if (tagsToRemove.length > 0) {
                await prisma.entityTag.deleteMany({
                    where: {
                        entityType,
                        entityId,
                        tagId: { in: tagsToRemove.map((t) => t.id) },
                    },
                });
            }
            if (newTags.length > 0) {
                const existingEntityTags = await prisma.entityTag.findMany({
                    where: {
                        entityType,
                        entityId,
                        tagId: { in: newTags.map((tag) => tag.id) },
                    },
                    select: { tagId: true },
                });
                const existingTagIds = new Set(existingEntityTags.map((et) => et.tagId));
                const tagsToCreate = newTags.filter((tag) => !existingTagIds.has(tag.id));
                if (tagsToCreate.length > 0) {
                    await prisma.entityTag.createMany({
                        data: tagsToCreate.map((tag) => ({
                            entityType,
                            entityId,
                            tagId: tag.id,
                            createdById: userId,
                        })),
                    });
                }
            }
        });
        const result = await Promise.all(existingTags.map(async (et) => {
            const tag = await this.prisma.tag.findUnique({
                where: { id: et.tagId },
            });
            if (!tag) {
                throw new common_1.NotFoundException(`Tag with ID ${et.tagId} not found`);
            }
            return {
                id: tag.id,
                name: tag.name,
                color: tag.color,
                createdAt: et.createdAt,
            };
        }));
        const newTagResults = await Promise.all(newTags.map(async (tag) => {
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
        }));
        return [...result, ...newTagResults];
    }
    async getEntityTags(entityType, entityId) {
        const entityTags = await this.prisma.entityTag.findMany({
            where: {
                entityType,
                entityId,
            },
            include: {
                tag: true,
            },
        });
        return entityTags.map((et) => ({
            id: et.tag.id,
            name: et.tag.name,
            color: et.tag.color,
            createdAt: et.createdAt,
        }));
    }
    async findAll(filter) {
        const where = {};
        if (filter?.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { name: { contains: filter.search.toLowerCase() } },
                { name: { contains: filter.search.toUpperCase() } },
            ];
        }
        const tags = await this.prisma.tag.findMany({
            where,
            include: {
                _count: {
                    select: { entityTags: true },
                },
            },
            take: filter?.limit,
        });
        return tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            description: tag.description,
            color: tag.color,
            count: tag._count.entityTags,
        }));
    }
    async findEntitiesByTags(entityType, tags) {
        if (!tags.length)
            return [];
        const result = await this.prisma.$queryRaw `
      SELECT "entityId"
      FROM "EntityTag" et
      JOIN "Tag" t ON et."tagId" = t.id
      WHERE et."entityType" = ${entityType}
      AND t.name IN (${client_1.Prisma.join(tags)})
      GROUP BY "entityId"
      HAVING COUNT(DISTINCT t.name) = ${tags.length}
    `;
        return result.map(r => r.entityId);
    }
    async deleteTag(tagId, force = false) {
        const tag = await this.prisma.tag.findUnique({
            where: { id: tagId },
            include: {
                _count: { select: { entityTags: true } },
            },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with ID ${tagId} not found`);
        }
        if (tag._count.entityTags > 0 && !force) {
            throw new common_1.BadRequestException(`Cannot delete tag '${tag.name}' as it's still in use. Use force=true to delete anyway.`);
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
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagsService);
//# sourceMappingURL=tags.service.js.map