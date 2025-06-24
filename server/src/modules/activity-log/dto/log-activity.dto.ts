import { IsString, IsOptional, IsObject, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogActivityDto {
  @ApiProperty({ description: 'The project ID this activity is related to' })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ description: 'The user ID who performed the activity' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    description: 'The type of activity/event',
    examples: ['project.create', 'project.update', 'file.upload', 'file.delete', 'user.join', 'user.leave']
  })
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'project.create', 'project.update', 'project.delete',
    'file.upload', 'file.update', 'file.delete',
    'user.join', 'user.leave', 'user.role_change',
    'snapshot.create', 'snapshot.restore', 'snapshot.delete',
    'comment.create', 'comment.update', 'comment.delete',
    'settings.update', 'collaboration.start', 'collaboration.end'
  ])
  event: string;

  @ApiProperty({
    description: 'Additional data related to the activity',
    type: 'object',
    required: false,
    example: { filename: 'drum_loop.wav', size: 1024 }
  })
  @IsObject()
  @IsOptional()
  payload?: Record<string, any>;

  @ApiProperty({
    description: 'IP address of the client',
    required: false,
    example: '192.168.1.1'
  })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({
    description: 'User agent string of the client',
    required: false,
    example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  })
  @IsString()
  @IsOptional()
  userAgent?: string;
}
