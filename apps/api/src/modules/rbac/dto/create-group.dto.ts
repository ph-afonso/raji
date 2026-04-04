// modules/rbac/dto/create-group.dto.ts

import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({ description: 'Nome do grupo', example: 'Gerente Financeiro' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Slug unico do grupo (lowercase, hifens)',
    example: 'gerente-financeiro',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug deve conter apenas letras minusculas, numeros e hifens',
  })
  @MinLength(2)
  @MaxLength(50)
  slug: string;

  @ApiPropertyOptional({ description: 'Descricao do grupo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
