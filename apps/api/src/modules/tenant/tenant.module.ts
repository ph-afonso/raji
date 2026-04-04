// modules/tenant/tenant.module.ts
// Modulo global de multi-tenancy

import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './tenant.interceptor';
import { TenantService } from './tenant.service';

@Global()
@Module({
  providers: [
    TenantService,
    // Registrar interceptor globalmente
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  exports: [TenantService],
})
export class TenantModule {}
