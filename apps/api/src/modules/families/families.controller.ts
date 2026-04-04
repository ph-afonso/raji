// modules/families/families.controller.ts
// Controller de familias

import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FamiliesService } from './families.service';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { CurrentUser, RequestUser } from '@/modules/common/decorators/current-user.decorator';
import { CurrentFamily } from '@/modules/common/decorators/current-family.decorator';

@ApiTags('Families')
@ApiBearerAuth()
@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Dados da familia do usuario logado' })
  async getMyFamily(@CurrentFamily() familyId: string) {
    return this.familiesService.findMyFamily(familyId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar nome da familia do usuario logado (apenas Master)' })
  async updateFamily(
    @CurrentFamily() familyId: string,
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateFamilyDto,
  ) {
    return this.familiesService.updateFamily(familyId, dto, user.isFamilyOwner);
  }

  @Get('me/members')
  @ApiOperation({ summary: 'Listar membros da familia' })
  async listMembers(@CurrentFamily() familyId: string) {
    return this.familiesService.listMembers(familyId);
  }
}
