import { IsString } from 'class-validator';

export class RtcOfferDto {
  type!: string;

  sdp!: string;

  to!: string;
}
