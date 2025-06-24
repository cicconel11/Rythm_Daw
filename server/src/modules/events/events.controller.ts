import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { TrackEventsBulkDto } from './dto/track-event.dto';

@ApiTags('Analytics')
@Controller('v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('bulk')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ 
    summary: 'Track multiple analytics events',
    description: 'Accepts up to 50 events per request. Events are processed asynchronously.'
  })
  @ApiResponse({ 
    status: HttpStatus.ACCEPTED, 
    description: 'Events accepted for processing' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid event data or too many events',
  })
  @ApiBody({ 
    type: TrackEventsBulkDto,
    examples: {
      basic: {
        summary: 'Basic event tracking',
        value: {
          events: [
            {
              type: 'page_view',
              name: 'Home Page',
              properties: {
                path: '/home',
                referrer: 'https://google.com'
              },
              context: {
                ip: '192.168.1.1',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                osName: 'macOS',
                browserName: 'Chrome'
              }
            }
          ]
        }
      }
    }
  })
  async trackBulk(@Body() dto: TrackEventsBulkDto) {
    await this.eventsService.trackBulk(dto);
    return { success: true, message: 'Events accepted for processing' };
  }
}
