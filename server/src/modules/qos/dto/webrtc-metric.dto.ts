import { IsNumber, IsOptional, IsString, IsUUID, IsIn, IsEnum, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum MetricCategory {
  CONNECTION = 'connection',
  QUALITY = 'quality',
  NETWORK = 'network',
  MEDIA = 'media',
  OTHER = 'other',
}

export class WebRtcMetricDto {
  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Project ID',
    example: 'project-456',
    required: false,
  })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiProperty({
    description: 'Peer connection ID',
    example: 'pc_1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  peerConnectionId?: string;

  @ApiProperty({
    description: 'Round-trip time in milliseconds',
    example: 45.2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  rttMs?: number;

  @ApiProperty({
    description: 'Jitter in milliseconds',
    example: 2.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  jitterMs?: number;

  @ApiProperty({
    description: 'Packet loss percentage (0-100)',
    example: 1.2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  packetLoss?: number;

  @ApiProperty({
    description: 'Metric category',
    example: MetricCategory.CONNECTION,
    enum: MetricCategory,
  })
  @IsEnum(MetricCategory)
  category: MetricCategory;

  @ApiProperty({
    description: 'Metric value',
    example: 1.0,
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Network type',
    example: 'wifi',
    enum: ['wifi', 'cellular', 'ethernet', 'vpn', 'other'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['wifi', 'cellular', 'ethernet', 'vpn', 'other'])
  networkType?: string;

  @ApiProperty({
    description: 'Effective network type',
    example: '4g',
    enum: ['slow-2g', '2g', '3g', '4g'],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsIn(['slow-2g', '2g', '3g', '4g'])
  effectiveType?: string;

  @ApiProperty({
    description: 'Estimated downlink speed in Mbps',
    example: 10.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  downlinkMbps?: number;

  @ApiProperty({
    description: 'When the metric was created',
    example: new Date().toISOString(),
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @ApiProperty({
    description: 'Additional metadata',
    example: { key: 'value' },
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'ICE candidate pair ID',
    example: 'ice-pair-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  iceCandidatePairId?: string;

  @ApiProperty({
    description: 'Local candidate ID',
    example: 'local-cand-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  localCandidateId?: string;

  @ApiProperty({
    description: 'Remote candidate ID',
    example: 'remote-cand-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  remoteCandidateId?: string;
}
