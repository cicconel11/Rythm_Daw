import { User } from '../users/entities/user.entity';
import { FileTransferService } from './file-transfer.service';
import { PresignDto, AcceptDto, DeclineDto } from './dto';
export declare class FileTransferController {
    private readonly service;
    constructor(service: FileTransferService);
    presign(dto: PresignDto, user: User): Promise<{
        uploadUrl: string;
        transferId: any;
    }>;
    getTransfers(user: User): Promise<any>;
    accept(id: string, user: User, dto: AcceptDto): Promise<{
        downloadUrl: string;
    }>;
    decline(id: string, user: User, dto: DeclineDto): Promise<{
        message: string;
    }>;
    download(id: string, user: User): Promise<{
        downloadUrl: string;
    }>;
}
