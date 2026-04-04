// test/unit/auth.service.spec.ts
// Testes unitarios do AuthService

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/modules/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { RbacService } from '../../src/modules/rbac/rbac.service';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;
  let rbacService: jest.Mocked<RbacService>;

  const mockUser = {
    id: 'user-1',
    email: 'test@email.com',
    name: 'Test User',
    passwordHash: 'hashed-password',
    familyId: 'family-1',
    groupId: 'group-master',
    isActive: true,
    isFamilyOwner: true,
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    group: {
      id: 'group-master',
      name: 'Administrador',
      slug: 'master',
      description: 'Acesso total',
      isDefault: true,
      isEditable: false,
      familyId: 'family-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockFamily = {
    id: 'family-1',
    name: 'Familia Test',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      family: {
        create: jest.fn(),
      },
      subscription: {
        create: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const mockJwt = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
    };

    const mockRbac = {
      seedDefaultGroups: jest.fn().mockResolvedValue({
        masterId: 'group-master',
        memberFullId: 'group-member',
        dependentId: 'group-dependent',
      }),
      seedDefaultCategories: jest.fn().mockResolvedValue(undefined),
      getGroupPermissions: jest.fn().mockResolvedValue([
        { id: 'p1', module: 'transactions', action: 'create', description: 'Criar' },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: RbacService, useValue: mockRbac },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    rbacService = module.get(RbacService);
  });

  // ============================================================
  // REGISTER
  // ============================================================

  describe('register', () => {
    const registerDto = {
      name: 'Test User',
      email: 'test@email.com',
      password: 'Senh@F0rte123',
      familyName: 'Familia Test',
    };

    it('deve registrar um novo usuario com sucesso', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.family.create as jest.Mock).mockResolvedValue(mockFamily);
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      (prismaService.subscription.create as jest.Mock).mockResolvedValue({});
      (prismaService.refreshToken.create as jest.Mock).mockResolvedValue({});

      const result = await authService.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(registerDto.email);
      expect(prismaService.family.create).toHaveBeenCalled();
      expect(rbacService.seedDefaultGroups).toHaveBeenCalledWith(mockFamily.id);
      expect(rbacService.seedDefaultCategories).toHaveBeenCalledWith(mockFamily.id);
    });

    it('deve rejeitar email duplicado', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ============================================================
  // LOGIN
  // ============================================================

  describe('login', () => {
    const loginDto = {
      email: 'test@email.com',
      password: 'Senh@F0rte123',
    };

    it('deve fazer login com sucesso', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prismaService.refreshToken.create as jest.Mock).mockResolvedValue({});

      const result = await authService.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('permissions');
      expect(result.user.email).toBe(loginDto.email);
    });

    it('deve rejeitar credenciais invalidas (email nao encontrado)', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve rejeitar credenciais invalidas (senha incorreta)', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('deve rejeitar usuario inativo', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(inactiveUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ============================================================
  // REFRESH TOKEN
  // ============================================================

  describe('refreshToken', () => {
    const mockStoredToken = {
      id: 'token-1',
      tokenHash: 'hashed-token',
      userId: 'user-1',
      isRevoked: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 dias
      user: {
        id: 'user-1',
        email: 'test@email.com',
        familyId: 'family-1',
        groupId: 'group-master',
        isActive: true,
      },
    };

    it('deve renovar tokens com sucesso', async () => {
      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(mockStoredToken);
      (prismaService.refreshToken.update as jest.Mock).mockResolvedValue({});
      (prismaService.refreshToken.create as jest.Mock).mockResolvedValue({});

      const result = await authService.refreshToken('user-1', 'token-1', 'raw-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(prismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 'token-1' },
        data: { isRevoked: true },
      });
    });

    it('deve rejeitar refresh token expirado', async () => {
      const expiredToken = {
        ...mockStoredToken,
        expiresAt: new Date(Date.now() - 1000), // Expirado
      };
      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(expiredToken);

      await expect(
        authService.refreshToken('user-1', 'token-1', 'raw-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve rejeitar refresh token revogado e invalidar todos', async () => {
      const revokedToken = {
        ...mockStoredToken,
        isRevoked: true,
      };
      (prismaService.refreshToken.findUnique as jest.Mock).mockResolvedValue(revokedToken);
      (prismaService.refreshToken.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await expect(
        authService.refreshToken('user-1', 'token-1', 'raw-token'),
      ).rejects.toThrow(UnauthorizedException);

      // Deve ter revogado todos os tokens do usuario
      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });

  // ============================================================
  // LOGOUT
  // ============================================================

  describe('logout', () => {
    it('deve revogar todos os tokens do usuario', async () => {
      (prismaService.refreshToken.updateMany as jest.Mock).mockResolvedValue({ count: 2 });

      await authService.logout('user-1');

      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRevoked: false },
        data: { isRevoked: true },
      });
    });

    it('deve revogar token especifico quando tokenId fornecido', async () => {
      (prismaService.refreshToken.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      await authService.logout('user-1', 'token-1');

      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { id: 'token-1', userId: 'user-1' },
        data: { isRevoked: true },
      });
    });
  });
});
