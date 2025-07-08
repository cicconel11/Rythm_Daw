import { Request } from 'express';
import { SnapshotsService } from './snapshots.service';
interface RequestWithUser extends Request {
    user: {
        sub: string;
        email: string;
        [key: string]: any;
    };
}
export declare class SnapshotsController {
    private readonly snapshotsService;
    constructor(snapshotsService: SnapshotsService);
    create(req: RequestWithUser, file: Express.Multer.File, createSnapshotDto: any): Promise<any>;
    findAll(req: RequestWithUser, projectId: string): Promise<any[]>;
    findOne(req: RequestWithUser, projectId: string, snapshotId: string): Promise<any>;
}
export {};
