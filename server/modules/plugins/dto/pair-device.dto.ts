import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class PairDeviceDto {
  @ApiProperty({ description: 'Pairing code displayed on the device' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Pairing code must be 6 characters long' })
  code: string;
}
