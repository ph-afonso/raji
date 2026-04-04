// test/unit/rbac.service.spec.ts
// Testes unitarios do RbacService

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RbacService } from '../../src/modules/rbac/rbac.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('RbacService', () => {
  let rbacService: RbacService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = {
      groupPermission: {
        count: jest.fn(),
        findMany: jest.fn(),
        createMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      permission: {
        findMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        count: jest.fn(),
      },
      group: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      category: {
        createMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    rbacService = module.get<RbacService>(RbacService);
    prismaService = module.get(PrismaService);
  });

  // ============================================================
  // userHasPermission
  // ============================================================

  describe('userHasPermission', () => {
    it('deve retornar true quando grupo tem a permissao', async () => {
      (prismaService.groupPermission.count as jest.Mock).mockResolvedValue(1);

      const result = await rbacService.userHasPermission(
        'group-1',
        'transactions',
        'create',
      );

      expect(result).toBe(true);
      expect(prismaService.groupPermission.count).toHaveBeenCalledWith({
        where: {
          groupId: 'group-1',
          permission: { module: 'transactions', action: 'create' },
        },
      });
    });

    it('deve retornar false quando grupo nao tem a permissao', async () => {
      (prismaService.groupPermission.count as jest.Mock).mockResolvedValue(0);

      const result = await rbacService.userHasPermission(
        'group-dependent',
        'transactions',
        'create',
      );

      expect(result).toBe(false);
    });

    it('deve retornar true para grupo master (que possui todas as permissoes)', async () => {
      // O grupo master tem todas as permissoes vinculadas via GroupPermission
      (prismaService.groupPermission.count as jest.Mock).mockResolvedValue(1);

      const result = await rbacService.userHasPermission(
        'group-master',
        'billing',
        'manage',
      );

      expect(result).toBe(true);
    });
  });

  // ============================================================
  // getGroupPermissions
  // ============================================================

  describe('getGroupPermissions', () => {
    it('deve retornar permissoes do grupo', async () => {
      const mockPermissions = [
        {
          permission: { id: 'p1', module: 'transactions', action: 'read', description: 'Visualizar' },
        },
        {
          permission: { id: 'p2', module: 'transactions', action: 'create', description: 'Criar' },
        },
      ];

      (prismaService.groupPermission.findMany as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await rbacService.getGroupPermissions('group-1');

      expect(result).toHaveLength(2);
      expect(result[0].module).toBe('transactions');
    });
  });

  // ============================================================
  // getUserPermissions
  // ============================================================

  describe('getUserPermissions', () => {
    it('deve retornar permissoes do usuario via grupo', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        groupId: 'group-1',
      });

      const mockPermissions = [
        { permission: { id: 'p1', module: 'accounts', action: 'read', description: 'Visualizar' } },
      ];
      (prismaService.groupPermission.findMany as jest.Mock).mockResolvedValue(mockPermissions);

      const result = await rbacService.getUserPermissions('user-1');

      expect(result).toHaveLength(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { groupId: true },
      });
    });

    it('deve lancar NotFoundException se usuario nao encontrado', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(rbacService.getUserPermissions('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ============================================================
  // seedDefaultGroups
  // ============================================================

  describe('seedDefaultGroups', () => {
    it('deve criar 3 grupos padrao com permissoes corretas', async () => {
      // Mock das permissoes do sistema
      const allPermissions = [
        { id: 'p1', module: 'transactions', action: 'create' },
        { id: 'p2', module: 'transactions', action: 'read' },
        { id: 'p3', module: 'accounts', action: 'read' },
        { id: 'p4', module: 'billing', action: 'manage' },
      ];

      (prismaService.permission.findMany as jest.Mock).mockResolvedValue(allPermissions);

      // Mock criacao dos grupos
      (prismaService.group.create as jest.Mock)
        .mockResolvedValueOnce({ id: 'master-id' })     // master
        .mockResolvedValueOnce({ id: 'member-id' })     // member-full
        .mockResolvedValueOnce({ id: 'dependent-id' }); // dependent

      (prismaService.groupPermission.createMany as jest.Mock).mockResolvedValue({ count: 1 });

      const result = await rbacService.seedDefaultGroups('family-new');

      // Verificar retorno dos 3 IDs
      expect(result).toEqual({
        masterId: 'master-id',
        memberFullId: 'member-id',
        dependentId: 'dependent-id',
      });

      // Verificar que 3 grupos foram criados
      expect(prismaService.group.create).toHaveBeenCalledTimes(3);

      // Verificar que o grupo master foi criado com slug correto
      expect(prismaService.group.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'master',
            isDefault: true,
            isEditable: false,
            familyId: 'family-new',
          }),
        }),
      );

      // Verificar que o grupo member-full foi criado
      expect(prismaService.group.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'member-full',
            isDefault: true,
            isEditable: true,
          }),
        }),
      );

      // Verificar que o grupo dependent foi criado
      expect(prismaService.group.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'dependent',
            isDefault: true,
            isEditable: true,
          }),
        }),
      );

      // Verificar que permissoes foram atribuidas a cada grupo (3 chamadas de createMany)
      expect(prismaService.groupPermission.createMany).toHaveBeenCalledTimes(3);

      // Master deve ter TODAS as permissoes
      expect(prismaService.groupPermission.createMany).toHaveBeenCalledWith({
        data: allPermissions.map((p) => ({
          groupId: 'master-id',
          permissionId: p.id,
        })),
      });
    });
  });

  // ============================================================
  // deleteGroup
  // ============================================================

  describe('deleteGroup', () => {
    it('deve rejeitar exclusao de grupo padrao', async () => {
      (prismaService.group.findFirst as jest.Mock).mockResolvedValue({
        id: 'group-1',
        isDefault: true,
        familyId: 'family-1',
      });

      await expect(
        rbacService.deleteGroup('group-1', 'family-1'),
      ).rejects.toThrow('Grupos padrao nao podem ser deletados');
    });

    it('deve rejeitar exclusao de grupo com usuarios', async () => {
      (prismaService.group.findFirst as jest.Mock).mockResolvedValue({
        id: 'group-custom',
        isDefault: false,
        familyId: 'family-1',
      });
      (prismaService.user.count as jest.Mock).mockResolvedValue(2);

      await expect(
        rbacService.deleteGroup('group-custom', 'family-1'),
      ).rejects.toThrow('Nao e possivel deletar grupo com usuarios vinculados');
    });
  });
});
