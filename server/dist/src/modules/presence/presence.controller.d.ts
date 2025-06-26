import { Request } from 'express';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { PresenceService } from './presence.service';
export declare class PresenceController {
    private readonly presenceService;
    constructor(presenceService: PresenceService);
    heartbeat(req: Request, dto: HeartbeatDto): Promise<void>;
}
