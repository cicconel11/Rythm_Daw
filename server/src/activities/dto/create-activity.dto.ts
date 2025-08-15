import { ActivityType } from '@prisma/client';
import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  actorId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsObject()
  payload?: any;
}
