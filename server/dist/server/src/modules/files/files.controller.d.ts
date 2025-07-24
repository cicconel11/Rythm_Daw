import { FileMetaDto } from './dto/file-meta.dto';
import { FilesService } from './files.service';
import { User } from '../users/entities/user.entity';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    create(dto: FileMetaDto, user: User): Promise<{
        putUrl: string;
        getUrl: string;
    } | {
        uploadUrl: string;
        downloadUrl: string;
    }>;
    uploadFile(dto: FileMetaDto, user: User): Promise<{
        putUrl: string;
        getUrl: string;
    } | {
        uploadUrl: string;
        downloadUrl: string;
    }>;
}
