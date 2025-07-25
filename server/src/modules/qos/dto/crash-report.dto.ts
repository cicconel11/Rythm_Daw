import { IsString, IsOptional, IsObject, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrashReportDto {
  @ApiProperty({
    description: 'Type of the crash/error',
    example: 'uncaught',
    enum: ['uncaught', 'unhandledrejection', 'window_error', 'promise_rejection', 'resource_error', 'other'],
  })
  @IsString()
  @IsIn(['uncaught', 'unhandledrejection', 'window_error', 'promise_rejection', 'resource_error', 'other'])
  type!: string;

  @ApiProperty({
    description: 'Error name',
    example: 'TypeError',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Cannot read property of undefined',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    description: 'Stack trace (will be encrypted)',
    example: 'TypeError: Cannot read property of undefined\n    at App.componentWillMount (webpack-internal:///./src/App.js:24:7)',
    required: false,
  })
  @IsString()
  @IsOptional()
  stack?: string;

  @ApiProperty({
    description: 'Platform where the crash occurred',
    example: 'web',
    enum: ['web', 'windows', 'macos', 'linux', 'ios', 'android'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['web', 'windows', 'macos', 'linux', 'ios', 'android'])
  platform?: string;

  @ApiProperty({
    description: 'Operating system name and version',
    example: 'Windows 10',
    required: false,
  })
  @IsString()
  @IsOptional()
  os?: string;

  @ApiProperty({
    description: 'Browser name and version',
    example: 'Chrome 91.0.4472.124',
    required: false,
  })
  @IsString()
  @IsOptional()
  browser?: string;

  @ApiProperty({
    description: 'User agent string',
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    required: false,
  })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiProperty({
    description: 'URL where the crash occurred',
    example: 'https://example.com/dashboard',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Memory usage at crash time',
    example: { jsHeapSizeLimit: 2330000000, usedJSHeapSize: 12345678, totalJSHeapSize: 23456789 },
    required: false,
  })
  @IsObject()
  @IsOptional()
  memoryUsage?: {
    jsHeapSizeLimit?: number;
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
  };

  @ApiProperty({
    description: 'Breadcrumbs leading to the crash (will be encrypted)',
    example: [
      { type: 'navigation', data: { from: '/', to: '/dashboard' }, timestamp: 1624567890 },
      { type: 'click', data: { id: 'save-button' }, timestamp: 1624567891 }
    ],
    required: false,
  })
  @IsObject({ each: true })
  @IsOptional()
  breadcrumbs?: Array<Record<string, unknown>>;

  @ApiProperty({
    description: 'Additional context (will be encrypted)',
    example: { userId: 'user_123', projectId: 'proj_456' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  context?: Record<string, unknown>;

  @ApiProperty({
    description: 'Optional project ID',
    example: 'proj_123',
    required: false,
  })
  @IsString()
  @IsOptional()
  projectId?: string;
}
