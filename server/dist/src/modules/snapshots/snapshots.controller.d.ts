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
        name: string;
        data: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
    findAll(req: RequestWithUser, projectId: string): Promise<{
        files: {
            downloadUrl: string;
            path: string;
        }[];
        project: {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isPublic: boolean;
        };
        name: string;
        data: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }[]>;
    findOne(req: RequestWithUser, projectId: string, snapshotId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        name: string;
        data: import("@prisma/client/runtime/library").JsonValue;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
    }>;
}
export {};
