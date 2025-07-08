import { IsString, IsOptional, IsObject, IsIn, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogActivityDto {
  @ApiPropertyOptional({ 
    description: 'The ID of the user who performed the action',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
  @ApiPropertyOptional({ 
    description: 'The ID of the entity this activity is about',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsString()
  @IsOptional()
  entityId?: string;

  @ApiPropertyOptional({
    description: 'The type of entity this activity is about',
    enum: ['user', 'project', 'plugin', 'file', 'comment']
  })
  @IsString()
  @IsIn(['user', 'project', 'plugin', 'file', 'comment'])
  @IsOptional()
  entityType?: string;

  @ApiPropertyOptional({ 
    description: 'The ID of the project this activity is related to'
  })
  @IsString()
  @IsOptional()
  projectId?: string | null;

  @ApiProperty({ 
    description: 'The action performed',
    enum: ['created', 'updated', 'deleted', 'viewed', 'logged_in', 'logged_out']
  })
  @IsString()
  @IsNotEmpty()
  action!: string;

  @ApiPropertyOptional({
    description: 'Additional metadata about the activity',
    example: { field: 'name', oldValue: 'Old', newValue: 'New' }
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'IP address of the user who performed the action'
  })
  @IsString()
  @IsOptional()
  ipAddress?: string | null;

  @ApiPropertyOptional({
    description: 'User agent string of the client that performed the action'
  })
  @IsString()
  @IsOptional()
  userAgent?: string | null;
}
