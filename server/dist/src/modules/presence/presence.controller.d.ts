import { HeartbeatDto } from './dto/heartbeat.dto';
import { PresenceService } from './presence.service';
import { RequestWithUser } from '../../constants/request-with-user';
export declare class PresenceController {
    private readonly presenceService;
    constructor(presenceService: PresenceService);
    heartbeat(req: RequestWithUser, dto: HeartbeatDto): Promise<void>;
}
