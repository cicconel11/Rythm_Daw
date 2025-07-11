import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTagsDto } from './dto/update-tags.dto';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    updateEntityTags(entityType: string, entityId: string, userId: string, dto: UpdateTagsDto): Promise<{
        id: string;
        name: string;
        color: string | null;
        createdAt: Date;
    }[]>;
    getEntityTags(entityType: string, entityId: string): Promise<{
        id: string;
        name: string;
        color: string | null;
        createdAt: Date;
    }[]>;
    findAll(filter?: {
        search?: string;
        limit?: number;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string | null;
        count: number;
    }[]>;
    findEntitiesByTags(entityType: string, tags: string[]): Promise<string[]>;
    deleteTag(tagId: string, force?: boolean): Promise<void>;
}
