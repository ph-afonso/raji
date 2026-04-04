// filters/http-exception.filter.ts
// Filter global de excecoes HTTP — retorna response padronizado de erro

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Formato padrao de resposta de erro:
 * { success: false, error: { code: string, message: string, details: object } }
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let code: string;
    let details: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        code = this.getErrorCode(status);
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || exception.message;
        code = (resp.error as string) || this.getErrorCode(status);

        // class-validator retorna array de mensagens
        if (Array.isArray(resp.message)) {
          message = 'Validation failed';
          details = { errors: resp.message };
        }
      } else {
        message = exception.message;
        code = this.getErrorCode(status);
      }
    } else {
      // Erro inesperado (nao-HTTP)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = 'INTERNAL_SERVER_ERROR';

      this.logger.error(
        `Erro inesperado: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code,
        message,
        details,
      },
    });
  }

  /**
   * Mapeia status HTTP para codigo de erro legivel.
   */
  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
    };

    return codeMap[status] || `HTTP_${status}`;
  }
}
