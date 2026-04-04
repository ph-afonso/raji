// modules/auth/dto/refresh-token.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token JWT' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
