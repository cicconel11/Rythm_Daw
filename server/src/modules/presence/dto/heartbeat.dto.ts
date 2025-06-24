import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum UserStatus {
  ONLINE = 'online',
  IN_DAW = 'in-daw',
  RECORDING = 'recording',
  IDLE = 'idle',
}

export class HeartbeatDto {
  @IsEnum(UserStatus)
  status: UserStatus;
  
  @IsOptional()
  @IsString()
  projectId?: string;
  
  @IsOptional()
  @IsString()
  sessionId?: string;
}
