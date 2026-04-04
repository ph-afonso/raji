// modules/tenant/tenant.service.ts
// Servico utilitario para filtragem multi-tenant

import { Injectable } from '@nestjs/common';

/**
 * Helper com metodos utilitarios para filtragem por tenant (familyId).
 * Usado por services de dominio para garantir isolamento de dados.
 */
@Injectable()
export class TenantService {
  /**
   * Retorna o filtro where base para queries Prisma filtradas por tenant.
   */
  getWhereFilter(familyId: string): { familyId: string } {
    return { familyId };
  }

  /**
   * Adiciona familyId a um objeto de dados (para creates).
   */
  addTenantId<T extends Record<string, unknown>>(
    data: T,
    familyId: string,
  ): T & { familyId: string } {
    return { ...data, familyId };
  }

  /**
   * Verifica se um recurso pertence ao tenant especificado.
   */
  belongsToTenant(
    resource: { familyId: string } | null | undefined,
    familyId: string,
  ): boolean {
    if (!resource) return false;
    return resource.familyId === familyId;
  }
}
