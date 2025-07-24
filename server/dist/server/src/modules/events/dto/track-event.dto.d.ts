export declare class EventContextDto {
    ip?: string;
    userAgent?: string;
    url?: string;
    path?: string;
    referrer?: string;
    osName?: string;
    osVersion?: string;
    browserName?: string;
    browserVersion?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    country?: string;
    region?: string;
    city?: string;
    traits?: Record<string, any>;
}
export declare class EventDto {
    type: string;
    name?: string;
    userId?: string;
    anonymousId?: string;
    sessionId?: string;
    projectId?: string;
    timestamp?: string;
    properties?: Record<string, any>;
    context?: EventContextDto;
}
export declare class TrackEventsBulkDto {
    events: EventDto[];
    debug?: boolean;
}
