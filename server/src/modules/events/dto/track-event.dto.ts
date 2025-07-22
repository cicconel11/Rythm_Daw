import { IsString, IsOptional, IsArray, IsObject, IsISO8601, IsNotEmpty, IsEnum, IsBoolean, IsNumber, MaxLength, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class EventContextDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  ip?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  userAgent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  referrer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  osName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  osVersion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  browserName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  browserVersion?: string;

  @IsOptional()
  @IsString()
  @IsIn(['mobile', 'desktop', 'tablet'])
  deviceType?: 'mobile' | 'desktop' | 'tablet';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsObject()
  traits?: Record<string, any>;
}

export class EventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  type!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  userId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  anonymousId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  sessionId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  projectId?: string;

  @IsISO8601()
  @IsOptional()
  timestamp?: string;

  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;

  @IsOptional()
  @Type(() => EventContextDto)
  context?: EventContextDto;
}

export class TrackEventsBulkDto {
  @IsArray()
  @Type(() => EventDto)
  events!: EventDto[];

  @IsBoolean()
  @IsOptional()
  debug?: boolean = false;
}
