import { SnapshotsService } from './snapshots.service';
import { RequestWithUser } from '../../constants/request-with-user';
export declare class SnapshotsController {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    create(req: RequestWithUser, file: Express.Multer.File, createSnapshotDto: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: string;
        description: string | null;
        projectId: string;
    }>;
    findAll(req: RequestWithUser, projectId: string): Promise<any[]>;
    findOne(req: RequestWithUser, projectId: string, snapshotId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: string;
        description: string | null;
        projectId: string;
    }>;
}
