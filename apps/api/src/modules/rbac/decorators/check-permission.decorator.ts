// modules/rbac/decorators/check-permission.decorator.ts
// Decorator @CheckPermission('module', 'action') para protecao de endpoints via RBAC

import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export interface PermissionMetadata {
  module: string;
  action: string;
}

/**
 * Decorator que define a permissao necessaria para acessar um endpoint.
 * Usado em conjunto com o PermissionGuard.
 *
 * Uso:
 *   @CheckPermission('transactions', 'create')
 *   @Post()
 *   create() { ... }
 */
export const CheckPermission = (module: string, action: string) =>
  SetMetadata(PERMISSION_KEY, { module, action } as PermissionMetadata);
