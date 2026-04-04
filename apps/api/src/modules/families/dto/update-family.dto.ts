// modules/families/dto/update-family.dto.ts

import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFamilyDto {
  @ApiProperty({ description: 'Novo nome da familia', example: 'Familia Santos' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
