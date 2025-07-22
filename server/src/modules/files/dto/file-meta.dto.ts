import { IsString, IsNumber } from 'class-validator';

export class FileMetaDto {
  name!: string;

  @IsString()
  mime!: string;

  @IsNumber()
  size!: number;
}
