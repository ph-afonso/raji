// modules/users/users.controller.ts
// Controller de usuarios

import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser, RequestUser } from '@/modules/common/decorators/current-user.decorator';
import { CurrentFamily } from '@/modules/common/decorators/current-family.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Dados do usuario logado' })
  async getMe(@CurrentUser() user: RequestUser) {
    return this.usersService.findMe(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Dados de um usuario da mesma familia' })
  async getById(
    @Param('id') id: string,
    @CurrentFamily() familyId: string,
  ) {
    return this.usersService.findById(id, familyId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil do usuario logado' })
  async updateMe(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateMe(user.id, dto);
  }
}
