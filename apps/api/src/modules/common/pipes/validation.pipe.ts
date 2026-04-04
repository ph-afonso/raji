// pipes/validation.pipe.ts
// Wrapper do ValidationPipe do NestJS com whitelist e transform habilitados

import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

/**
 * Cria uma instancia configurada do ValidationPipe.
 *
 * Opcoes padrao:
 * - whitelist: remove propriedades nao-decoradas do DTO
 * - transform: converte tipos automaticamente (string -> number, etc.)
 * - forbidNonWhitelisted: lanca erro se receber propriedades desconhecidas
 * - transformOptions.enableImplicitConversion: conversao implicita de tipos
 */
export function createValidationPipe(
  options?: ValidationPipeOptions,
): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    ...options,
  });
}

/**
 * Instancia padrao do ValidationPipe, pronta para uso como provider global.
 */
export const AppValidationPipe = createValidationPipe();
