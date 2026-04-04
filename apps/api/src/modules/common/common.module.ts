// modules/common/common.module.ts
// Modulo comum que registra providers globais (filters, interceptors, pipes)

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppValidationPipe } from './pipes/validation.pipe';

@Module({
  providers: [
    // Filter global de excecoes — padroniza resposta de erro
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Interceptor de transformacao — wrapa response em { success: true, data }
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Interceptor de logging — registra method, url, status, duracao
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // Pipe de validacao — whitelist + transform + forbidNonWhitelisted
    {
      provide: APP_PIPE,
      useValue: AppValidationPipe,
    },
  ],
})
export class CommonModule {}
