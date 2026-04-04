// interceptors/transform.interceptor.ts
// Interceptor que wrapa toda response de sucesso no formato padrao

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Formato padrao de resposta de sucesso:
 * { success: true, data: { ... } }
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data,
      })),
    );
  }
}
