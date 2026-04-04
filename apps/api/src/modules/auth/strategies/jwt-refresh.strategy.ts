// modules/auth/strategies/jwt-refresh.strategy.ts
// Passport JWT Refresh Strategy — valida refresh token

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export interface JwtRefreshPayload {
  sub: string; // userId
  tokenId: string; // refreshToken ID no DB
  type: 'refresh';
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_REFRESH_SECRET ||
        'raji-dev-refresh-secret-change-in-prod',
      passReqToCallback: true,
    });
  }

  /**
   * Validacao do refresh token payload.
   * Retorna dados necessarios para rotacao de tokens.
   */
  async validate(req: Request, payload: JwtRefreshPayload) {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Token invalido');
    }

    const refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token nao fornecido');
    }

    return {
      id: payload.sub,
      tokenId: payload.tokenId,
      refreshToken,
    };
  }
}
