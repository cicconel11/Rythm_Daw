import { Request } from 'express';
import { HeartbeatDto } from './dto/heartbeat.dto';
import { PresenceService } from './presence.service';
interface RequestWithUser extends Request {
    user: {
        sub: string;
        email: string;
        [key: string]: any;
    };
}
export declare class PresenceController {
    private readonly presenceService;
    constructor(presenceService: PresenceService);
    heartbeat(req: RequestWithUser, dto: HeartbeatDto): Promise<void>;
}
export {};
