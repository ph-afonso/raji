// prisma/prisma.module.ts
// Modulo global do Prisma — disponivel em toda a aplicacao

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
