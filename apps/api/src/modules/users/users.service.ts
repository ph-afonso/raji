// modules/users/users.service.ts
// Service de usuarios — queries filtradas por familyId (tenant)

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca o usuario logado pelo ID.
   */
  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isActive: true,
        isFamilyOwner: true,
        familyId: true,
        groupId: true,
        createdAt: true,
        updatedAt: true,
        group: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }

  /**
   * Busca um usuario por ID, filtrando pela mesma familia.
   */
  async findById(userId: string, familyId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, familyId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isActive: true,
        isFamilyOwner: true,
        groupId: true,
        createdAt: true,
        group: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return user;
  }

  /**
   * Atualiza o perfil do usuario logado.
   */
  async updateMe(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        isActive: true,
        isFamilyOwner: true,
        familyId: true,
        groupId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Busca usuario por email (usado internamente pelo auth).
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        group: true,
      },
    });
  }
}
