// modules/auth/decorators/public.decorator.ts
// Decorator @Public() para marcar endpoints que nao requerem autenticacao JWT

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca um endpoint como publico (sem necessidade de JWT).
 * Usado em conjunto com o JwtAuthGuard global.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
