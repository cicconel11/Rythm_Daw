import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTagsDto } from './dto/update-tags.dto';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    updateEntityTags(entityType: string, entityId: string, userId: string, dto: UpdateTagsDto): Promise<any[]>;
    getEntityTags(entityType: string, entityId: string): Promise<any>;
    findAll(filter?: {
        search?: string;
        limit?: number;
    }): Promise<any>;
    findEntitiesByTags(entityType: string, tags: string[]): Promise<string[]>;
    deleteTag(tagId: string, force?: boolean): Promise<void>;
}
