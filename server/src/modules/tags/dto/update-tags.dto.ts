import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagsDto {
  @ApiProperty({
    description: 'Array of tag names to associate with the entity',
    example: ['drum-loop', 'bassline', 'work-in-progress'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'Optional color for new tags',
    example: '#3B82F6',
    required: false,
  })
  @IsString()
  @IsOptional()
  defaultColor?: string;
}
