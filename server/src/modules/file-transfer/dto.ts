import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class PresignDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsNumber()
  size: number;

  @IsUUID()
  toUserId: string;
}

export class AcceptDto {
  @IsOptional()
  @IsString()
  message?: string;
}

export class DeclineDto {
  @IsOptional()
  @IsString()
  reason?: string;
} 