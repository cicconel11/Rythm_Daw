import { SnapshotsService } from './snapshots.service';
import type { RequestWithUser } from '../../constants/request-with-user';
export declare class SnapshotsController {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    create(req: RequestWithUser, file: Express.Multer.File, createSnapshotDto: any): Promise<any>;
    findAll(req: RequestWithUser, projectId: string): Promise<any[]>;
    findOne(req: RequestWithUser, projectId: string, snapshotId: string): Promise<any>;
}
