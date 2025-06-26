export declare class FileMetadataDto {
    path: string;
    hash: string;
    mimeType: string;
    size?: number;
}
export declare class CreateSnapshotDto {
    projectId: string;
    name: string;
    description?: string;
    metadata: Record<string, any>;
    files?: FileMetadataDto[];
}
