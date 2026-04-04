// modules/rbac/rbac.service.ts
// Service RBAC — permissoes, grupos padrao, verificacao de acesso

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Definicoes das permissoes por modulo do sistema.
 * Reutilizado do seed.ts para manter consistencia.
 */
interface PermissionDef {
  module: string;
  action: string;
  description: string;
}

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifica se o grupo do usuario tem a permissao especificada.
   * Retorna true se o grupo possui a permissao module:action.
   */
  async userHasPermission(
    groupId: string,
    module: string,
    action: string,
  ): Promise<boolean> {
    const count = await this.prisma.groupPermission.count({
      where: {
        groupId,
        permission: {
          module,
          action,
        },
      },
    });

    return count > 0;
  }

  /**
   * Retorna todas as permissoes de um grupo.
   */
  async getGroupPermissions(groupId: string) {
    const groupPermissions = await this.prisma.groupPermission.findMany({
      where: { groupId },
      include: {
        permission: {
          select: { id: true, module: true, action: true, description: true },
        },
      },
    });

    return groupPermissions.map((gp) => gp.permission);
  }

  /**
   * Retorna as permissoes do usuario (via seu grupo).
   */
  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { groupId: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return this.getGroupPermissions(user.groupId);
  }

  /**
   * Lista todas as permissoes cadastradas no sistema.
   */
  async getAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }

  /**
   * Lista os grupos de uma familia.
   */
  async listGroups(familyId: string) {
    return this.prisma.group.findMany({
      where: { familyId },
      include: {
        _count: { select: { users: true, groupPermissions: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Cria um grupo customizado para uma familia.
   */
  async createGroup(
    familyId: string,
    data: { name: string; slug: string; description?: string },
  ) {
    return this.prisma.group.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        isDefault: false,
        isEditable: true,
        familyId,
      },
    });
  }

  /**
   * Atualiza um grupo existente.
   */
  async updateGroup(
    groupId: string,
    familyId: string,
    data: { name?: string; description?: string },
  ) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, familyId },
    });

    if (!group) {
      throw new NotFoundException('Grupo nao encontrado');
    }

    return this.prisma.group.update({
      where: { id: groupId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  /**
   * Deleta um grupo customizado (grupos padrao nao podem ser deletados).
   */
  async deleteGroup(groupId: string, familyId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, familyId },
    });

    if (!group) {
      throw new NotFoundException('Grupo nao encontrado');
    }

    if (group.isDefault) {
      throw new Error('Grupos padrao nao podem ser deletados');
    }

    // Verificar se ha usuarios no grupo
    const usersInGroup = await this.prisma.user.count({
      where: { groupId },
    });

    if (usersInGroup > 0) {
      throw new Error('Nao e possivel deletar grupo com usuarios vinculados');
    }

    return this.prisma.group.delete({ where: { id: groupId } });
  }

  /**
   * Atualiza as permissoes de um grupo (substitui todas).
   */
  async updateGroupPermissions(
    groupId: string,
    familyId: string,
    permissionIds: string[],
  ) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, familyId },
    });

    if (!group) {
      throw new NotFoundException('Grupo nao encontrado');
    }

    if (!group.isEditable) {
      throw new Error('As permissoes deste grupo nao podem ser editadas');
    }

    // Deletar permissoes existentes e criar novas em transacao
    await this.prisma.$transaction([
      this.prisma.groupPermission.deleteMany({ where: { groupId } }),
      this.prisma.groupPermission.createMany({
        data: permissionIds.map((permissionId) => ({
          groupId,
          permissionId,
        })),
      }),
    ]);

    return this.getGroupPermissions(groupId);
  }

  /**
   * Cria os 3 grupos padrao com suas permissoes para uma nova familia.
   * Reutiliza a mesma logica do seed.ts.
   * Retorna os IDs dos grupos criados.
   */
  async seedDefaultGroups(
    familyId: string,
  ): Promise<{ masterId: string; memberFullId: string; dependentId: string }> {
    // Buscar todas as permissoes do sistema
    const allPermissions = await this.prisma.permission.findMany();

    // Criar mapa module:action -> permissionId
    const permMap = new Map<string, string>();
    for (const p of allPermissions) {
      permMap.set(`${p.module}:${p.action}`, p.id);
    }

    const getPermIds = (keys: string[]): string[] => {
      return keys
        .map((k) => permMap.get(k))
        .filter((id): id is string => id !== undefined);
    };

    // --- Grupo MASTER: todas as permissoes ---
    const masterGroup = await this.prisma.group.create({
      data: {
        name: 'Administrador',
        slug: 'master',
        description: 'Acesso total a todas as funcionalidades',
        isDefault: true,
        isEditable: false,
        familyId,
      },
    });

    await this.prisma.groupPermission.createMany({
      data: allPermissions.map((p) => ({
        groupId: masterGroup.id,
        permissionId: p.id,
      })),
    });

    // --- Grupo MEMBER-FULL: CRUD financeiro completo ---
    const memberFullGroup = await this.prisma.group.create({
      data: {
        name: 'Membro',
        slug: 'member-full',
        description: 'CRUD financeiro completo, sem acesso a billing e gerenciamento de membros',
        isDefault: true,
        isEditable: true,
        familyId,
      },
    });

    const memberFullPermKeys = [
      'accounts:create', 'accounts:read', 'accounts:update', 'accounts:delete',
      'transactions:create', 'transactions:read', 'transactions:update', 'transactions:delete',
      'categories:create', 'categories:read', 'categories:update', 'categories:delete',
      'budgets:create', 'budgets:read', 'budgets:update', 'budgets:delete',
      'savings_goals:create', 'savings_goals:read', 'savings_goals:update', 'savings_goals:delete',
      'recurring:create', 'recurring:read', 'recurring:update', 'recurring:delete',
      'reports:read',
      'notifications:read', 'notifications:manage',
    ];

    await this.prisma.groupPermission.createMany({
      data: getPermIds(memberFullPermKeys).map((permissionId) => ({
        groupId: memberFullGroup.id,
        permissionId,
      })),
    });

    // --- Grupo DEPENDENT: somente leitura ---
    const dependentGroup = await this.prisma.group.create({
      data: {
        name: 'Dependente',
        slug: 'dependent',
        description: 'Acesso somente leitura a todas as informacoes financeiras',
        isDefault: true,
        isEditable: true,
        familyId,
      },
    });

    const dependentPermKeys = [
      'accounts:read',
      'transactions:read',
      'categories:read',
      'budgets:read',
      'savings_goals:read',
      'recurring:read',
      'reports:read',
      'notifications:read',
    ];

    await this.prisma.groupPermission.createMany({
      data: getPermIds(dependentPermKeys).map((permissionId) => ({
        groupId: dependentGroup.id,
        permissionId,
      })),
    });

    return {
      masterId: masterGroup.id,
      memberFullId: memberFullGroup.id,
      dependentId: dependentGroup.id,
    };
  }

  /**
   * Cria as categorias padrao para uma nova familia.
   * Reutiliza a mesma logica do seed.ts.
   */
  async seedDefaultCategories(familyId: string): Promise<void> {
    const incomeCategories = [
      { name: 'Salario', icon: 'mdi-cash', color: '#4CAF50' },
      { name: 'Freelance', icon: 'mdi-laptop', color: '#8BC34A' },
      { name: 'Investimentos', icon: 'mdi-chart-line', color: '#009688' },
      { name: 'Presente', icon: 'mdi-gift', color: '#FF9800' },
      { name: 'Outros', icon: 'mdi-dots-horizontal', color: '#9E9E9E' },
    ];

    const expenseCategories = [
      { name: 'Alimentacao', icon: 'mdi-food', color: '#F44336' },
      { name: 'Transporte', icon: 'mdi-car', color: '#2196F3' },
      { name: 'Moradia', icon: 'mdi-home', color: '#795548' },
      { name: 'Saude', icon: 'mdi-hospital', color: '#E91E63' },
      { name: 'Educacao', icon: 'mdi-school', color: '#3F51B5' },
      { name: 'Lazer', icon: 'mdi-gamepad-variant', color: '#9C27B0' },
      { name: 'Vestuario', icon: 'mdi-tshirt-crew', color: '#FF5722' },
      { name: 'Servicos', icon: 'mdi-wrench', color: '#607D8B' },
      { name: 'Assinaturas', icon: 'mdi-credit-card-clock', color: '#00BCD4' },
      { name: 'Outros', icon: 'mdi-dots-horizontal', color: '#9E9E9E' },
    ];

    const categoryData = [
      ...incomeCategories.map((cat, i) => ({
        name: cat.name,
        type: 'INCOME' as const,
        icon: cat.icon,
        color: cat.color,
        isSystem: true,
        sortOrder: i,
        familyId,
      })),
      ...expenseCategories.map((cat, i) => ({
        name: cat.name,
        type: 'EXPENSE' as const,
        icon: cat.icon,
        color: cat.color,
        isSystem: true,
        sortOrder: i,
        familyId,
      })),
    ];

    await this.prisma.category.createMany({ data: categoryData });
  }
}
