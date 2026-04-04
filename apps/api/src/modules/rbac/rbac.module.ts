// modules/rbac/rbac.module.ts

import { Global, Module } from '@nestjs/common';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { PermissionGuard } from './guards/permission.guard';

@Global()
@Module({
  controllers: [RbacController],
  providers: [RbacService, PermissionGuard],
  exports: [RbacService, PermissionGuard],
})
export class RbacModule {}
