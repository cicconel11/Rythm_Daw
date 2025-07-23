import { PluginsService } from './plugins.service';
export declare class PluginsController {
    private svc;
    constructor(svc: PluginsService);
    latest(platform?: string): Promise<{
        url: string;
        filename: string;
    }>;
}
