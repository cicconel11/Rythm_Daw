import { IsString, IsNumber } from 'class-validator';

export class FileMetaDto {
  @IsString()
  name: string;

  @IsString()
  mime: string;

  @IsNumber()
  size: number;
}
