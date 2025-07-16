import { EventsService } from './events.service';
import { TrackEventsBulkDto } from './dto/track-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    trackBulk(dto: TrackEventsBulkDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
