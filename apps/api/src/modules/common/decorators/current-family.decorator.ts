// decorators/current-family.decorator.ts
// Decorator @CurrentFamily() — extrai o familyId (tenantId) do request

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Decorator de parametro que extrai o familyId do usuario autenticado.
 * O familyId funciona como tenantId para isolamento multi-tenant.
 *
 * Uso:
 *   @Get('accounts')
 *   listAccounts(@CurrentFamily() familyId: string) { ... }
 *
 * O familyId vem do JWT token, populado pelo JwtStrategy no campo user.familyId.
 */
export const CurrentFamily = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: { familyId?: string } }).user;

    return user?.familyId;
  },
);
