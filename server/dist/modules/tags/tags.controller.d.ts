import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { TagsService } from './tags.service';
import { UpdateTagsDto } from './dto/update-tags.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    updateEntityTags(entityType: string, entityId: string, user: JwtPayload, updateTagsDto: UpdateTagsDto): Promise<any[]>;
    getEntityTags(entityType: string, entityId: string): Promise<any>;
    findAll(search?: string, limit?: number): Promise<any>;
    deleteTag(tagId: string, force?: boolean): Promise<void>;
}
