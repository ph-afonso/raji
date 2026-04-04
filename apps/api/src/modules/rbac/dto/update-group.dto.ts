// modules/rbac/dto/update-group.dto.ts

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGroupDto {
  @ApiPropertyOptional({ description: 'Nome do grupo', example: 'Gerente' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ description: 'Descricao do grupo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
