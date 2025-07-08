import { Request, Response } from 'express';
export declare class FileShare {
    static handleSignal(req: Request, res: Response): Promise<any>;
    static handleFileUpload(req: Request, res: Response): Promise<any>;
    static getFileUrl(req: Request, res: Response): Promise<any>;
    static checkFileStatus(req: Request, res: Response): Promise<any>;
    private static calculateFileHash;
    private static scanFileForViruses;
}
export declare const uploadMiddleware: any;
