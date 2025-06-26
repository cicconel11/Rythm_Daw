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
var _a;
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
                tag: true,
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
        await this.prisma.$transaction([
            ...(tagsToRemove.length > 0
                ? [
                    this.prisma.entityTag.deleteMany({
                        where: {
                            id: { in: tagsToRemove.map((t) => t.id) },
                        },
                    }),
                ]
                : []),
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
        return this.getEntityTags(entityType, entityId);
    }
    async getEntityTags(entityType, entityId) {
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
    async getAllTags(entityType) {
        const where = {};
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
        return result.map((r) => r.entityId);
    }
    async deleteTag(tagId, force = false) {
        const tag = await this.prisma.tag.findUnique({
            where: { id: tagId },
            include: {
                _count: {
                    select: { entities: true },
                },
            },
        });
        if (!tag) {
            throw new common_1.NotFoundException(`Tag with ID ${tagId} not found`);
        }
        if (tag._count.entities > 0 && !force) {
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
TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TagsService);
exports.TagsService = TagsService;
//# sourceMappingURL=tags.service.js.map