// modules/tenant/tenant.interceptor.ts
// Interceptor multi-tenant — extrai familyId do user JWT e injeta como tenantId no request

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

/**
 * Extrai o familyId do request.user (populado pelo JWT guard)
 * e o injeta como request.tenantId para uso em services e queries.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = (request as Request & { user?: { familyId?: string } }).user;

    if (user?.familyId) {
      (request as Request & { tenantId: string }).tenantId = user.familyId;
    }

    return next.handle();
  }
}
