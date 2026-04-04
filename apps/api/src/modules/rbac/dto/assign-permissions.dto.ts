// modules/rbac/dto/assign-permissions.dto.ts

import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Lista de IDs de permissoes a atribuir ao grupo',
    type: [String],
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
