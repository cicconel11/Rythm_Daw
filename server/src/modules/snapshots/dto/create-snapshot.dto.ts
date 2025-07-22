import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class FileMetadataDto {
  @IsString()
  path!: string;

  @IsString()
  hash!: string;

  @IsString()
  mimeType!: string;

  @IsOptional()
  size?: number;
}

export class CreateSnapshotDto {
  @IsUUID()
  projectId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  metadata!: Record<string, any>;

  @IsArray()
  @IsOptional()
  files?: FileMetadataDto[];
}
