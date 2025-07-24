import { ConfigService } from '@nestjs/config';
export declare class PluginsService {
    private config;
    constructor(config: ConfigService);
    private s3;
    getLatest(platform?: string): Promise<{
        url: string;
        filename: string;
    }>;
}
