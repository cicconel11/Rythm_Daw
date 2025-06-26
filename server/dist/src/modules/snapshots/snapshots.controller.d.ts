import { Request } from 'express';
import { SnapshotsService } from './snapshots.service';
export declare class SnapshotsController {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    create(req: Request, file: Express.Multer.File, createSnapshotDto: any): Promise<any>;
    findAll(req: Request, projectId: string): Promise<any>;
    findOne(req: Request, projectId: string, snapshotId: string): Promise<any>;
}
