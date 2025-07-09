import { IsString } from 'class-validator';

export class RtcAnswerDto {
  @IsString()
  type: string;

  @IsString()
  sdp: string;

  @IsString()
  to: string;
}
