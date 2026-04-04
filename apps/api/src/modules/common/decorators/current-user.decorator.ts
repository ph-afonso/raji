// decorators/current-user.decorator.ts
// Decorator @CurrentUser() — extrai o usuario autenticado do request

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Interface do usuario presente no request apos autenticacao JWT.
 * Populado pelo JwtStrategy / AuthGuard.
 */
export interface RequestUser {
  id: string;
  email: string;
  familyId: string;
  groupId: string;
  isFamilyOwner: boolean;
}

/**
 * Decorator de parametro que extrai o usuario autenticado do request.
 *
 * Uso:
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: RequestUser) { ... }
 *
 *   @Get('email')
 *   getEmail(@CurrentUser('email') email: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: RequestUser }).user;

    if (!user) {
      return undefined;
    }

    // Se um campo especifico foi solicitado, retorna apenas ele
    return data ? user[data] : user;
  },
);
