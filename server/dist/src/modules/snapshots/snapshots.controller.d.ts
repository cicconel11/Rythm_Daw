import { SnapshotsService } from './snapshots.service';
import { RequestWithUser } from '../../constants/request-with-user';
export declare class SnapshotsController {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    create(req: RequestWithUser, file: Express.Multer.File, createSnapshotDto: any): Promise<{
        description: string | null;
        data: string;
        name: string;
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: RequestWithUser, projectId: string): Promise<{
        files: {
            downloadUrl: string;
            path: string;
        }[];
        project: {
            description: string | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isPublic: boolean;
        };
        description: string | null;
        data: string;
        name: string;
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(req: RequestWithUser, projectId: string, snapshotId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        description: string | null;
        data: string;
        name: string;
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
