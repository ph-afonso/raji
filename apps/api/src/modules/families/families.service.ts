// modules/families/families.service.ts
// Service de familias — CRUD + seed de dados iniciais ao criar familia

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retorna os dados da familia do usuario logado.
   */
  async findMyFamily(familyId: string) {
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { users: true },
        },
      },
    });

    if (!family) {
      throw new NotFoundException('Familia nao encontrada');
    }

    return family;
  }

  /**
   * Atualiza o nome da familia.
   * Apenas o owner (master) pode atualizar.
   */
  async updateFamily(
    familyId: string,
    dto: UpdateFamilyDto,
    isFamilyOwner: boolean,
  ) {
    if (!isFamilyOwner) {
      throw new ForbiddenException('Apenas o titular da familia pode alterar o nome');
    }

    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
    });

    if (!family) {
      throw new NotFoundException('Familia nao encontrada');
    }

    return this.prisma.family.update({
      where: { id: familyId },
      data: { name: dto.name },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Lista todos os membros da familia.
   */
  async listMembers(familyId: string) {
    return this.prisma.user.findMany({
      where: { familyId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isActive: true,
        isFamilyOwner: true,
        createdAt: true,
        group: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Cria uma nova familia (usado internamente pelo auth.service no registro).
   */
  async create(dto: CreateFamilyDto) {
    return this.prisma.family.create({
      data: { name: dto.name },
    });
  }
}
