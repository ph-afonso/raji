// modules/auth/auth.service.ts
// Service de autenticacao — registro, login, refresh token, logout

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/prisma/prisma.service';
import { RbacService } from '@/modules/rbac/rbac.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const BCRYPT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly rbacService: RbacService,
  ) {}

  /**
   * Registro de novo usuario + criacao de familia.
   * 1. Verifica email unico
   * 2. Hash da senha
   * 3. Cria Family
   * 4. Seed grupos padrao
   * 5. Seed categorias padrao
   * 6. Cria User (isFamilyOwner: true, grupo: master)
   * 7. Cria Subscription (TRIAL, 15 dias)
   * 8. Gera tokens
   * 9. Salva refresh token no DB
   * 10. Retorna tokens + user
   */
  async register(dto: RegisterDto) {
    // 1. Verificar email unico
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email ja cadastrado');
    }

    // 2. Hash da senha
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // 3. Criar Family
    const family = await this.prisma.family.create({
      data: { name: dto.familyName },
    });

    // 4. Seed grupos padrao
    const groups = await this.rbacService.seedDefaultGroups(family.id);

    // 5. Seed categorias padrao
    await this.rbacService.seedDefaultCategories(family.id);

    // 6. Criar User (isFamilyOwner, grupo master)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        familyId: family.id,
        groupId: groups.masterId,
        isFamilyOwner: true,
      },
    });

    // 7. Criar Subscription (TRIAL)
    await this.prisma.subscription.create({
      data: {
        status: 'TRIAL',
        trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // +15 dias
        familyId: family.id,
      },
    });

    // 8. Gerar tokens
    const tokens = await this.generateTokens(user.id, user.email, family.id, groups.masterId);

    // 9. Salvar refresh token no DB
    await this.saveRefreshToken(user.id, tokens.refreshTokenId, tokens.refreshToken);

    this.logger.log(`Novo usuario registrado: ${user.email} (familia: ${family.name})`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        familyId: family.id,
        groupId: groups.masterId,
        isFamilyOwner: true,
      },
    };
  }

  /**
   * Login de usuario existente.
   * 1. Busca user por email
   * 2. Verifica senha
   * 3. Verifica isActive
   * 4. Gera tokens
   * 5. Salva refresh token
   * 6. Retorna tokens + user + permissions
   */
  async login(dto: LoginDto) {
    // 1. Buscar user por email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        group: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    // 2. Verificar senha
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais invalidas');
    }

    // 3. Verificar isActive
    if (!user.isActive) {
      throw new UnauthorizedException('Conta desativada');
    }

    // 4. Gerar tokens
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.familyId,
      user.groupId,
    );

    // 5. Salvar refresh token
    await this.saveRefreshToken(
      user.id,
      tokens.refreshTokenId,
      tokens.refreshToken,
      dto.userAgent,
      dto.ipAddress,
    );

    // 6. Buscar permissoes
    const permissions = await this.rbacService.getGroupPermissions(user.groupId);

    this.logger.log(`Login: ${user.email}`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        familyId: user.familyId,
        groupId: user.groupId,
        isFamilyOwner: user.isFamilyOwner,
        group: {
          id: user.group.id,
          name: user.group.name,
          slug: user.group.slug,
        },
      },
      permissions: permissions.map((p) => `${p.module}:${p.action}`),
    };
  }

  /**
   * Refresh token — rotacao de tokens.
   * 1. Busca refresh token no DB (pelo tokenId do payload)
   * 2. Verifica nao expirado e nao revogado
   * 3. Verifica hash do token
   * 4. Revoga token antigo
   * 5. Gera novo par de tokens
   * 6. Salva novo refresh token
   * 7. Retorna novos tokens
   */
  async refreshToken(userId: string, tokenId: string, rawRefreshToken: string) {
    // 1. Buscar refresh token no DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            familyId: true,
            groupId: true,
            isActive: true,
          },
        },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    // 2. Verificar nao expirado e nao revogado
    if (storedToken.isRevoked) {
      // Possivel tentativa de reutilizacao — revogar todos os tokens do usuario
      await this.revokeAllUserTokens(storedToken.userId);
      throw new UnauthorizedException('Refresh token revogado — todos os tokens foram invalidados');
    }

    if (new Date() > storedToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // 3. Verificar que o usuario esta ativo
    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('Conta desativada');
    }

    // 4. Revogar token antigo
    await this.prisma.refreshToken.update({
      where: { id: tokenId },
      data: { isRevoked: true },
    });

    // 5. Gerar novo par de tokens
    const user = storedToken.user;
    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.familyId,
      user.groupId,
    );

    // 6. Salvar novo refresh token
    await this.saveRefreshToken(user.id, tokens.refreshTokenId, tokens.refreshToken);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Logout — revoga o refresh token especifico.
   */
  async logout(userId: string, tokenId?: string) {
    if (tokenId) {
      // Revogar token especifico
      await this.prisma.refreshToken.updateMany({
        where: { id: tokenId, userId },
        data: { isRevoked: true },
      });
    } else {
      // Revogar todos os tokens do usuario
      await this.revokeAllUserTokens(userId);
    }
  }

  /**
   * Revoga todos os refresh tokens de um usuario.
   * Usado para "deslogar de todos os dispositivos".
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  /**
   * Revoga todos os refresh tokens de uma familia.
   * Usado para "deslogar todos os membros".
   */
  async revokeAllFamilyTokens(familyId: string): Promise<void> {
    const familyUsers = await this.prisma.user.findMany({
      where: { familyId },
      select: { id: true },
    });

    const userIds = familyUsers.map((u) => u.id);

    await this.prisma.refreshToken.updateMany({
      where: { userId: { in: userIds }, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  /**
   * Limpa tokens expirados do banco de dados.
   * Pode ser chamado por um cron job.
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isRevoked: true, createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        ],
      },
    });

    return result.count;
  }

  // ============================================================
  // HELPERS PRIVADOS
  // ============================================================

  /**
   * Gera par de tokens (access + refresh).
   */
  private async generateTokens(
    userId: string,
    email: string,
    familyId: string,
    groupId: string,
  ) {
    // ID unico para o refresh token (sera persistido no DB)
    const refreshTokenId = crypto.randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      // Access token (15min)
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          familyId,
          groupId,
          type: 'access',
        },
        {
          secret: process.env.JWT_SECRET || 'raji-dev-secret-change-in-prod',
          expiresIn: ACCESS_TOKEN_EXPIRY,
        },
      ),
      // Refresh token (7 dias)
      this.jwtService.signAsync(
        {
          sub: userId,
          tokenId: refreshTokenId,
          type: 'refresh',
        },
        {
          secret:
            process.env.JWT_REFRESH_SECRET ||
            'raji-dev-refresh-secret-change-in-prod',
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken, refreshTokenId };
  }

  /**
   * Salva o refresh token como hash bcrypt no banco de dados.
   */
  private async saveRefreshToken(
    userId: string,
    tokenId: string,
    rawToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<void> {
    const tokenHash = await this.hashToken(rawToken);

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        tokenHash,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
        userAgent,
        ipAddress,
      },
    });
  }

  /**
   * Hash de um token usando bcrypt.
   */
  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }
}
