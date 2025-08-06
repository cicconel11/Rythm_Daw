import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class PresignDto {
  fileName!: string;
  mimeType!: string;
  size!: number;
  toUserId!: string;
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