import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @ApiProperty({ description: 'The name of the user', required: false })
  name?: string;

  @ApiProperty({ description: 'Whether the user is approved', default: true })
  isApproved: boolean = true;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
