// prisma/seed.ts
// Seed de dados iniciais do Raji Finance
// Popula permissoes globais. Grupos e categorias sao criados no registro de familia.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================
// DEFINICOES DE PERMISSOES
// ============================================================

interface PermissionDef {
  module: string;
  action: string;
  description: string;
}

/**
 * Retorna todas as permissoes do sistema.
 * Cada modulo tem suas acoes especificas.
 */
function getAllPermissions(): PermissionDef[] {
  const permissions: PermissionDef[] = [];

  // Modulos com CRUD padrao (create, read, update, delete)
  const crudModules: Record<string, string> = {
    accounts: 'Contas',
    transactions: 'Transacoes',
    categories: 'Categorias',
    budgets: 'Orcamentos',
    savings_goals: 'Metas de economia',
    recurring: 'Transacoes recorrentes',
    family: 'Familia',
    groups: 'Grupos de permissao',
    reports: 'Relatorios',
  };

  const crudActions = ['create', 'read', 'update', 'delete'];

  for (const [module, label] of Object.entries(crudModules)) {
    for (const action of crudActions) {
      const actionLabels: Record<string, string> = {
        create: 'Criar',
        read: 'Visualizar',
        update: 'Editar',
        delete: 'Excluir',
      };
      permissions.push({
        module,
        action,
        description: `${actionLabels[action]} ${label.toLowerCase()}`,
      });
    }
  }

  // Transacoes: acao extra "import"
  permissions.push({
    module: 'transactions',
    action: 'import',
    description: 'Importar transacoes',
  });

  // Members: acoes especiais
  const memberActions = [
    { action: 'create', description: 'Criar membros' },
    { action: 'read', description: 'Visualizar membros' },
    { action: 'update', description: 'Editar membros' },
    { action: 'delete', description: 'Excluir membros' },
    { action: 'invite', description: 'Convidar membros' },
    { action: 'remove', description: 'Remover membros' },
    { action: 'change_group', description: 'Alterar grupo de membros' },
  ];

  for (const { action, description } of memberActions) {
    permissions.push({ module: 'members', action, description });
  }

  // Billing: CRUD + manage
  const billingActions = [
    { action: 'create', description: 'Criar cobrancas' },
    { action: 'read', description: 'Visualizar cobrancas' },
    { action: 'update', description: 'Editar cobrancas' },
    { action: 'delete', description: 'Excluir cobrancas' },
    { action: 'manage', description: 'Gerenciar assinatura e pagamentos' },
  ];

  for (const { action, description } of billingActions) {
    permissions.push({ module: 'billing', action, description });
  }

  // Notifications: CRUD + manage
  const notificationActions = [
    { action: 'create', description: 'Criar notificacoes' },
    { action: 'read', description: 'Visualizar notificacoes' },
    { action: 'update', description: 'Editar notificacoes' },
    { action: 'delete', description: 'Excluir notificacoes' },
    { action: 'manage', description: 'Gerenciar configuracoes de notificacao' },
  ];

  for (const { action, description } of notificationActions) {
    permissions.push({ module: 'notifications', action, description });
  }

  return permissions;
}

/**
 * Insere todas as permissoes globais no banco.
 * Usa upsert para ser idempotente.
 */
async function seedPermissions(): Promise<void> {
  const permissions = getAllPermissions();

  console.log(`Inserindo ${permissions.length} permissoes...`);

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: {
        module_action: {
          module: perm.module,
          action: perm.action,
        },
      },
      update: {
        description: perm.description,
      },
      create: {
        module: perm.module,
        action: perm.action,
        description: perm.description,
      },
    });
  }

  console.log('Permissoes inseridas com sucesso.');
}

// ============================================================
// FUNCOES REUTILIZAVEIS (usadas no registro de familia)
// ============================================================

/**
 * Cria os 3 grupos padrao para uma familia recem-criada.
 * Retorna os IDs dos grupos criados.
 *
 * Deve ser chamado durante o registro de uma nova familia.
 */
export async function seedDefaultGroupsForFamily(
  familyId: string,
): Promise<{ masterId: string; memberFullId: string; dependentId: string }> {
  // Buscar todas as permissoes do sistema
  const allPermissions = await prisma.permission.findMany();

  // Criar mapa module:action -> permissionId
  const permMap = new Map<string, string>();
  for (const p of allPermissions) {
    permMap.set(`${p.module}:${p.action}`, p.id);
  }

  // Helper para buscar IDs de permissoes
  const getPermIds = (keys: string[]): string[] => {
    return keys
      .map((k) => permMap.get(k))
      .filter((id): id is string => id !== undefined);
  };

  // --- Grupo MASTER: todas as permissoes ---
  const masterGroup = await prisma.group.create({
    data: {
      name: 'Administrador',
      slug: 'master',
      description: 'Acesso total a todas as funcionalidades',
      isDefault: true,
      isEditable: false,
      familyId,
    },
  });

  // Vincular todas as permissoes ao grupo master
  await prisma.groupPermission.createMany({
    data: allPermissions.map((p) => ({
      groupId: masterGroup.id,
      permissionId: p.id,
    })),
  });

  // --- Grupo MEMBER-FULL: CRUD financeiro completo ---
  const memberFullGroup = await prisma.group.create({
    data: {
      name: 'Membro',
      slug: 'member-full',
      description: 'CRUD financeiro completo, sem acesso a billing e gerenciamento de membros',
      isDefault: true,
      isEditable: true,
      familyId,
    },
  });

  // Permissoes do member-full: CRUD em modulos financeiros
  const memberFullPermKeys = [
    // Contas
    'accounts:create', 'accounts:read', 'accounts:update', 'accounts:delete',
    // Transacoes
    'transactions:create', 'transactions:read', 'transactions:update', 'transactions:delete',
    // Categorias
    'categories:create', 'categories:read', 'categories:update', 'categories:delete',
    // Orcamentos
    'budgets:create', 'budgets:read', 'budgets:update', 'budgets:delete',
    // Metas de economia
    'savings_goals:create', 'savings_goals:read', 'savings_goals:update', 'savings_goals:delete',
    // Recorrencias
    'recurring:create', 'recurring:read', 'recurring:update', 'recurring:delete',
    // Relatorios (somente leitura)
    'reports:read',
    // Notificacoes (leitura + manage)
    'notifications:read', 'notifications:manage',
  ];

  const memberFullPermIds = getPermIds(memberFullPermKeys);
  await prisma.groupPermission.createMany({
    data: memberFullPermIds.map((permissionId) => ({
      groupId: memberFullGroup.id,
      permissionId,
    })),
  });

  // --- Grupo DEPENDENT: somente leitura ---
  const dependentGroup = await prisma.group.create({
    data: {
      name: 'Dependente',
      slug: 'dependent',
      description: 'Acesso somente leitura a todas as informacoes financeiras',
      isDefault: true,
      isEditable: true,
      familyId,
    },
  });

  // Permissoes do dependent: somente read
  const dependentPermKeys = [
    'accounts:read',
    'transactions:read',
    'categories:read',
    'budgets:read',
    'savings_goals:read',
    'recurring:read',
    'reports:read',
    'notifications:read',
  ];

  const dependentPermIds = getPermIds(dependentPermKeys);
  await prisma.groupPermission.createMany({
    data: dependentPermIds.map((permissionId) => ({
      groupId: dependentGroup.id,
      permissionId,
    })),
  });

  console.log(`Grupos padrao criados para familia ${familyId}`);

  return {
    masterId: masterGroup.id,
    memberFullId: memberFullGroup.id,
    dependentId: dependentGroup.id,
  };
}

/**
 * Cria as categorias padrao para uma familia recem-criada.
 * Inclui categorias de receita e despesa com flag isSystem=true.
 *
 * Deve ser chamado durante o registro de uma nova familia.
 */
export async function seedDefaultCategories(familyId: string): Promise<void> {
  // Categorias de RECEITA
  const incomeCategories = [
    { name: 'Salario', icon: 'mdi-cash', color: '#4CAF50' },
    { name: 'Freelance', icon: 'mdi-laptop', color: '#8BC34A' },
    { name: 'Investimentos', icon: 'mdi-chart-line', color: '#009688' },
    { name: 'Presente', icon: 'mdi-gift', color: '#FF9800' },
    { name: 'Outros', icon: 'mdi-dots-horizontal', color: '#9E9E9E' },
  ];

  // Categorias de DESPESA
  const expenseCategories = [
    { name: 'Alimentacao', icon: 'mdi-food', color: '#F44336' },
    { name: 'Transporte', icon: 'mdi-car', color: '#2196F3' },
    { name: 'Moradia', icon: 'mdi-home', color: '#795548' },
    { name: 'Saude', icon: 'mdi-hospital', color: '#E91E63' },
    { name: 'Educacao', icon: 'mdi-school', color: '#3F51B5' },
    { name: 'Lazer', icon: 'mdi-gamepad-variant', color: '#9C27B0' },
    { name: 'Vestuario', icon: 'mdi-tshirt-crew', color: '#FF5722' },
    { name: 'Servicos', icon: 'mdi-wrench', color: '#607D8B' },
    { name: 'Assinaturas', icon: 'mdi-credit-card-clock', color: '#00BCD4' },
    { name: 'Outros', icon: 'mdi-dots-horizontal', color: '#9E9E9E' },
  ];

  // Inserir categorias de receita
  for (let i = 0; i < incomeCategories.length; i++) {
    const cat = incomeCategories[i];
    await prisma.category.create({
      data: {
        name: cat.name,
        type: 'INCOME',
        icon: cat.icon,
        color: cat.color,
        isSystem: true,
        sortOrder: i,
        familyId,
      },
    });
  }

  // Inserir categorias de despesa
  for (let i = 0; i < expenseCategories.length; i++) {
    const cat = expenseCategories[i];
    await prisma.category.create({
      data: {
        name: cat.name,
        type: 'EXPENSE',
        icon: cat.icon,
        color: cat.color,
        isSystem: true,
        sortOrder: i,
        familyId,
      },
    });
  }

  console.log(`Categorias padrao criadas para familia ${familyId}`);
}

// ============================================================
// FUNCAO PRINCIPAL DO SEED
// ============================================================

/**
 * Funcao principal do seed.
 * Executa apenas o seed de permissoes globais.
 * Grupos e categorias sao criados dinamicamente no registro de cada familia.
 */
async function main(): Promise<void> {
  console.log('Iniciando seed do Raji Finance...');
  console.log('---');

  await seedPermissions();

  console.log('---');
  console.log('Seed concluido com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
