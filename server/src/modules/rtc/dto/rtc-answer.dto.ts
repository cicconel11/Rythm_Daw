import { IsString } from 'class-validator';

export class RtcAnswerDto {
  type!: string;

  sdp!: string;

  to!: string;
}
