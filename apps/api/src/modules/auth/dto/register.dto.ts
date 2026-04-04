// modules/auth/dto/register.dto.ts

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Nome completo', example: 'Maria Silva' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Email', example: 'maria@email.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha (min 8 caracteres)', example: 'Senh@F0rte123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @ApiProperty({ description: 'Nome da familia', example: 'Familia Silva' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  familyName: string;
}
