import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PluginDto {
  @IsString()
  @IsNotEmpty()
  uid!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  vendor!: string;

  @IsString()
  @IsNotEmpty()
  version!: string;
}

export class SyncInventoryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PluginDto)
  plugins!: PluginDto[];

  @IsString()
  @IsNotEmpty()
  inventoryHash!: string;
}
