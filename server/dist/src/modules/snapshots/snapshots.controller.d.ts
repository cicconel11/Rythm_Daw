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
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        projectId: string;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        projectId: string;
    }[]>;
    findOne(req: RequestWithUser, projectId: string, snapshotId: string): Promise<{
        files: {
            path: string;
            downloadUrl: string;
        }[];
        description: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue;
        projectId: string;
    }>;
}
export {};
