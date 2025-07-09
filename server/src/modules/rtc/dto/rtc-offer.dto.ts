import { IsString } from 'class-validator';

export class RtcOfferDto {
  @IsString()
  type: string;

  @IsString()
  sdp: string;

  @IsString()
  to: string;
}
