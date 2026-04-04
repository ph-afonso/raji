// modules/rbac/guards/permission.guard.ts
// Guard RBAC — verifica se o usuario tem a permissao exigida pelo endpoint

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../rbac.service';
import {
  PERMISSION_KEY,
  PermissionMetadata,
} from '../decorators/check-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Ler metadata de permissao do endpoint via Reflector
    const permission = this.reflector.getAllAndOverride<
      PermissionMetadata | undefined
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    // 2. Se nao ha metadata de permissao, permite acesso
    if (!permission) {
      return true;
    }

    // 3. Extrair groupId do request.user (populado pelo JWT guard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.groupId) {
      throw new ForbiddenException('Usuario nao autenticado');
    }

    // 4. Verificar permissao via rbacService
    const hasPermission = await this.rbacService.userHasPermission(
      user.groupId,
      permission.module,
      permission.action,
    );

    // 5. Retornar resultado
    if (!hasPermission) {
      throw new ForbiddenException(
        `Sem permissao: ${permission.module}:${permission.action}`,
      );
    }

    return true;
  }
}
