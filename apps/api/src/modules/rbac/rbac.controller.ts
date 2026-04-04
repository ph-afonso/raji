// modules/rbac/rbac.controller.ts
// Controller de RBAC — grupos e permissoes

import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CheckPermission } from './decorators/check-permission.decorator';
import { PermissionGuard } from './guards/permission.guard';
import { CurrentFamily } from '@/modules/common/decorators/current-family.decorator';

@ApiTags('RBAC')
@ApiBearerAuth()
@UseGuards(PermissionGuard)
@Controller('groups')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get()
  @CheckPermission('groups', 'read')
  @ApiOperation({ summary: 'Listar grupos da familia' })
  async listGroups(@CurrentFamily() familyId: string) {
    return this.rbacService.listGroups(familyId);
  }

  @Post()
  @CheckPermission('groups', 'create')
  @ApiOperation({ summary: 'Criar grupo customizado' })
  async createGroup(
    @CurrentFamily() familyId: string,
    @Body() dto: CreateGroupDto,
  ) {
    return this.rbacService.createGroup(familyId, dto);
  }

  @Patch(':id')
  @CheckPermission('groups', 'update')
  @ApiOperation({ summary: 'Atualizar grupo' })
  async updateGroup(
    @Param('id') id: string,
    @CurrentFamily() familyId: string,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.rbacService.updateGroup(id, familyId, dto);
  }

  @Delete(':id')
  @CheckPermission('groups', 'delete')
  @ApiOperation({ summary: 'Deletar grupo (nao pode deletar default)' })
  async deleteGroup(
    @Param('id') id: string,
    @CurrentFamily() familyId: string,
  ) {
    try {
      await this.rbacService.deleteGroup(id, familyId);
      return { deleted: true };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Erro ao deletar grupo',
      );
    }
  }

  @Get('/permissions')
  @ApiOperation({ summary: 'Listar todas as permissoes do sistema' })
  async listPermissions() {
    return this.rbacService.getAllPermissions();
  }

  @Put(':id/permissions')
  @CheckPermission('groups', 'update')
  @ApiOperation({ summary: 'Atualizar permissoes de um grupo' })
  async updatePermissions(
    @Param('id') id: string,
    @CurrentFamily() familyId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    try {
      return await this.rbacService.updateGroupPermissions(
        id,
        familyId,
        dto.permissionIds,
      );
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Erro ao atualizar permissoes',
      );
    }
  }
}
