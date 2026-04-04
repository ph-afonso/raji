// modules/auth/guards/jwt-refresh.guard.ts
// Guard para rota de refresh token

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
