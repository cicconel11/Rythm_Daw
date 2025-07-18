import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { TagsService } from './tags.service';
import { UpdateTagsDto } from './dto/update-tags.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    updateEntityTags(entityType: string, entityId: string, user: JwtPayload, updateTagsDto: UpdateTagsDto): Promise<{
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
    findAll(search?: string, limit?: number): Promise<{
        id: string;
        name: string;
        description: string | null;
        color: string | null;
        count: number;
    }[]>;
    deleteTag(tagId: string, force?: boolean): Promise<void>;
}
