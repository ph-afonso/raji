import { Module } from '@nestjs/common';
import { CommonModule } from './modules/common';
import { PrismaModule } from './prisma';
import { TenantModule } from './modules/tenant';
import { UsersModule } from './modules/users';
import { FamiliesModule } from './modules/families';
import { RbacModule } from './modules/rbac';
import { AuthModule } from './modules/auth';

@Module({
  imports: [
    // Infraestrutura
    PrismaModule,     // Prisma ORM — global
    CommonModule,     // Filters, interceptors, pipes globais

    // Multi-tenancy
    TenantModule,     // Interceptor de tenant — global

    // Autenticacao e RBAC
    AuthModule,       // JWT + Passport + Guards globais
    RbacModule,       // Permissoes e grupos — global

    // Dominio
    UsersModule,      // Gerenciamento de usuarios
    FamiliesModule,   // Gerenciamento de familias
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
