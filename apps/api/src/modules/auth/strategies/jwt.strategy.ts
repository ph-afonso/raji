// modules/auth/strategies/jwt.strategy.ts
// Passport JWT Strategy — valida access token e popula request.user

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '@/prisma/prisma.service';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  familyId: string;
  groupId: string;
  type: 'access';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'raji-dev-secret-change-in-prod',
    });
  }

  /**
   * Validacao do payload JWT.
   * Retorna o objeto que sera injetado em request.user.
   */
  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Token invalido');
    }

    // Verificar se o usuario ainda existe e esta ativo
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        familyId: true,
        groupId: true,
        isActive: true,
        isFamilyOwner: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario nao encontrado ou inativo');
    }

    return {
      id: user.id,
      email: user.email,
      familyId: user.familyId,
      groupId: user.groupId,
      isFamilyOwner: user.isFamilyOwner,
    };
  }
}
