import { IsEmail, IsString, MinLength, IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  name?: string;
}
