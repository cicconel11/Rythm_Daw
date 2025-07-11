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
    create(req: RequestWithUser, file: Express.Multer.File, createSnapshotDto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        data: string;
        projectId: string;
    }>;
    findAll(req: RequestWithUser, projectId: string): Promise<{
        files: {
            downloadUrl: string;
            path: string;
        }[];
        project: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isPublic: boolean;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        data: string;
        projectId: string;
    }[]>;
    findOne(req: RequestWithUser, projectId: string, snapshotId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        data: string;
        projectId: string;
    }>;
}
export {};
