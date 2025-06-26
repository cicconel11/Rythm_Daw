import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTagsDto } from './dto/update-tags.dto';
export declare class TagsService {
    private prisma;
    constructor(prisma: PrismaService);
    updateEntityTags(entityType: string, entityId: string, userId: string, dto: UpdateTagsDto): Promise<any>;
    getEntityTags(entityType: string, entityId: string): Promise<any>;
    getAllTags(entityType?: string): Promise<any>;
    findEntitiesByTags(entityType: string, tags: string[]): Promise<any>;
    deleteTag(tagId: string, force?: boolean): Promise<void>;
}
