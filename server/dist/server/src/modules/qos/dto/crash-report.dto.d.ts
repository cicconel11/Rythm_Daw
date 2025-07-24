export declare class CrashReportDto {
    type: string;
    name?: string;
    message?: string;
    stack?: string;
    platform?: string;
    os?: string;
    browser?: string;
    userAgent?: string;
    url?: string;
    memoryUsage?: {
        jsHeapSizeLimit?: number;
        usedJSHeapSize?: number;
        totalJSHeapSize?: number;
    };
    breadcrumbs?: Array<Record<string, any>>;
    context?: Record<string, any>;
    projectId?: string;
}
