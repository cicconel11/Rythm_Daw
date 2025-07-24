export declare class LogActivityDto {
    userId?: string;
    entityId?: string;
    entityType?: string;
    projectId?: string | null;
    action: string;
    metadata?: Record<string, unknown> | null;
    ipAddress?: string | null;
    userAgent?: string | null;
}
