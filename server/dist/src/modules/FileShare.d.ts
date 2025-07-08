import { Request, Response } from 'express';
export declare class FileShare {
    static handleSignal(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static handleFileUpload(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    static getFileUrl(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
    static checkFileStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private static calculateFileHash;
    private static scanFileForViruses;
}
export declare const uploadMiddleware: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
