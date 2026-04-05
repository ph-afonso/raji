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
  moduleLabel: string;
  moduleDescription: string;
  moduleIcon: string;
  actionLabel: string;
  detailedDescription: string;
}

/**
 * Retorna todas as permissoes do sistema.
 * Cada modulo tem suas acoes especificas.
 * Os campos de label/description/icon sao usados pelo frontend para exibicao traduzida.
 */
function getAllPermissions(): PermissionDef[] {
  return [
    // ===== accounts (4) =====
    {
      module: 'accounts',
      action: 'create',
      description: 'Criar contas',
      moduleLabel: 'Contas',
      moduleDescription:
        'Gerenciamento de contas bancárias, carteiras e cartões de crédito. Inclui saldos e configurações de cada conta.',
      moduleIcon: 'account_balance',
      actionLabel: 'Criar',
      detailedDescription:
        'Permite cadastrar novas contas bancárias, carteiras ou cartões de crédito no sistema.',
    },
    {
      module: 'accounts',
      action: 'read',
      description: 'Visualizar contas',
      moduleLabel: 'Contas',
      moduleDescription:
        'Gerenciamento de contas bancárias, carteiras e cartões de crédito. Inclui saldos e configurações de cada conta.',
      moduleIcon: 'account_balance',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar a lista de contas, saldos e detalhes de cada conta.',
    },
    {
      module: 'accounts',
      action: 'update',
      description: 'Editar contas',
      moduleLabel: 'Contas',
      moduleDescription:
        'Gerenciamento de contas bancárias, carteiras e cartões de crédito. Inclui saldos e configurações de cada conta.',
      moduleIcon: 'account_balance',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar informações das contas como nome, tipo, cor e limites.',
    },
    {
      module: 'accounts',
      action: 'delete',
      description: 'Excluir contas',
      moduleLabel: 'Contas',
      moduleDescription:
        'Gerenciamento de contas bancárias, carteiras e cartões de crédito. Inclui saldos e configurações de cada conta.',
      moduleIcon: 'account_balance',
      actionLabel: 'Excluir',
      detailedDescription:
        'Permite excluir contas do sistema. Contas com transações serão desativadas.',
    },
    // ===== transactions (5) =====
    {
      module: 'transactions',
      action: 'create',
      description: 'Criar transações',
      moduleLabel: 'Transações',
      moduleDescription:
        'Registro de movimentações financeiras: receitas, despesas e transferências entre contas.',
      moduleIcon: 'receipt_long',
      actionLabel: 'Criar',
      detailedDescription:
        'Permite registrar novas receitas, despesas ou transferências entre contas.',
    },
    {
      module: 'transactions',
      action: 'read',
      description: 'Visualizar transações',
      moduleLabel: 'Transações',
      moduleDescription:
        'Registro de movimentações financeiras: receitas, despesas e transferências entre contas.',
      moduleIcon: 'receipt_long',
      actionLabel: 'Visualizar',
      detailedDescription:
        'Permite visualizar a lista de transações, filtrar por período, conta e categoria.',
    },
    {
      module: 'transactions',
      action: 'update',
      description: 'Editar transações',
      moduleLabel: 'Transações',
      moduleDescription:
        'Registro de movimentações financeiras: receitas, despesas e transferências entre contas.',
      moduleIcon: 'receipt_long',
      actionLabel: 'Editar',
      detailedDescription:
        'Permite editar transações existentes: valor, data, categoria ou descrição.',
    },
    {
      module: 'transactions',
      action: 'delete',
      description: 'Excluir transações',
      moduleLabel: 'Transações',
      moduleDescription:
        'Registro de movimentações financeiras: receitas, despesas e transferências entre contas.',
      moduleIcon: 'receipt_long',
      actionLabel: 'Excluir',
      detailedDescription:
        'Permite excluir transações. O saldo da conta será recalculado automaticamente.',
    },
    {
      module: 'transactions',
      action: 'import',
      description: 'Importar transações',
      moduleLabel: 'Transações',
      moduleDescription:
        'Registro de movimentações financeiras: receitas, despesas e transferências entre contas.',
      moduleIcon: 'receipt_long',
      actionLabel: 'Importar',
      detailedDescription:
        'Permite importar extratos bancários nos formatos CSV e OFX para lançamento automático.',
    },
    // ===== categories (4) =====
    {
      module: 'categories',
      action: 'create',
      description: 'Criar categorias',
      moduleLabel: 'Categorias',
      moduleDescription:
        'Organização dos gastos em categorias e subcategorias para classificar lançamentos (ex: Alimentação > Restaurante).',
      moduleIcon: 'category',
      actionLabel: 'Criar',
      detailedDescription: 'Permite criar novas categorias e subcategorias de gastos.',
    },
    {
      module: 'categories',
      action: 'read',
      description: 'Visualizar categorias',
      moduleLabel: 'Categorias',
      moduleDescription:
        'Organização dos gastos em categorias e subcategorias para classificar lançamentos (ex: Alimentação > Restaurante).',
      moduleIcon: 'category',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar a árvore de categorias do sistema.',
    },
    {
      module: 'categories',
      action: 'update',
      description: 'Editar categorias',
      moduleLabel: 'Categorias',
      moduleDescription:
        'Organização dos gastos em categorias e subcategorias para classificar lançamentos (ex: Alimentação > Restaurante).',
      moduleIcon: 'category',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar nomes, ícones e cores das categorias.',
    },
    {
      module: 'categories',
      action: 'delete',
      description: 'Excluir categorias',
      moduleLabel: 'Categorias',
      moduleDescription:
        'Organização dos gastos em categorias e subcategorias para classificar lançamentos (ex: Alimentação > Restaurante).',
      moduleIcon: 'category',
      actionLabel: 'Excluir',
      detailedDescription:
        'Permite excluir categorias customizadas. Categorias do sistema não podem ser removidas.',
    },
    // ===== budgets (4) =====
    {
      module: 'budgets',
      action: 'create',
      description: 'Criar orçamentos',
      moduleLabel: 'Orçamentos',
      moduleDescription:
        'Definição de limites de gastos mensais por categoria, com alertas quando o orçamento está próximo do limite.',
      moduleIcon: 'savings',
      actionLabel: 'Criar',
      detailedDescription: 'Permite definir novos limites de orçamento mensal por categoria.',
    },
    {
      module: 'budgets',
      action: 'read',
      description: 'Visualizar orçamentos',
      moduleLabel: 'Orçamentos',
      moduleDescription:
        'Definição de limites de gastos mensais por categoria, com alertas quando o orçamento está próximo do limite.',
      moduleIcon: 'savings',
      actionLabel: 'Visualizar',
      detailedDescription:
        'Permite visualizar os orçamentos e o progresso de gastos em cada categoria.',
    },
    {
      module: 'budgets',
      action: 'update',
      description: 'Editar orçamentos',
      moduleLabel: 'Orçamentos',
      moduleDescription:
        'Definição de limites de gastos mensais por categoria, com alertas quando o orçamento está próximo do limite.',
      moduleIcon: 'savings',
      actionLabel: 'Editar',
      detailedDescription: 'Permite alterar os valores e alertas dos orçamentos existentes.',
    },
    {
      module: 'budgets',
      action: 'delete',
      description: 'Excluir orçamentos',
      moduleLabel: 'Orçamentos',
      moduleDescription:
        'Definição de limites de gastos mensais por categoria, com alertas quando o orçamento está próximo do limite.',
      moduleIcon: 'savings',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite remover orçamentos de categorias.',
    },
    // ===== savings_goals (4) =====
    {
      module: 'savings_goals',
      action: 'create',
      description: 'Criar metas de economia',
      moduleLabel: 'Metas de Economia',
      moduleDescription:
        'Metas de economia familiar com acompanhamento de progresso e contribuições (ex: Viagem, Reserva de Emergência).',
      moduleIcon: 'flag',
      actionLabel: 'Criar',
      detailedDescription: 'Permite criar novas metas de economia com valor alvo e data limite.',
    },
    {
      module: 'savings_goals',
      action: 'read',
      description: 'Visualizar metas de economia',
      moduleLabel: 'Metas de Economia',
      moduleDescription:
        'Metas de economia familiar com acompanhamento de progresso e contribuições (ex: Viagem, Reserva de Emergência).',
      moduleIcon: 'flag',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar metas, progresso e histórico de contribuições.',
    },
    {
      module: 'savings_goals',
      action: 'update',
      description: 'Editar metas de economia',
      moduleLabel: 'Metas de Economia',
      moduleDescription:
        'Metas de economia familiar com acompanhamento de progresso e contribuições (ex: Viagem, Reserva de Emergência).',
      moduleIcon: 'flag',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar metas: nome, valor alvo, data e descrição.',
    },
    {
      module: 'savings_goals',
      action: 'delete',
      description: 'Excluir metas de economia',
      moduleLabel: 'Metas de Economia',
      moduleDescription:
        'Metas de economia familiar com acompanhamento de progresso e contribuições (ex: Viagem, Reserva de Emergência).',
      moduleIcon: 'flag',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite excluir metas de economia e seus registros de contribuição.',
    },
    // ===== recurring (4) =====
    {
      module: 'recurring',
      action: 'create',
      description: 'Criar recorrências',
      moduleLabel: 'Recorrências',
      moduleDescription:
        'Lançamentos automáticos de contas fixas como aluguel, assinaturas e parcelas recorrentes.',
      moduleIcon: 'autorenew',
      actionLabel: 'Criar',
      detailedDescription:
        'Permite cadastrar novas transações recorrentes (ex: aluguel mensal, assinatura).',
    },
    {
      module: 'recurring',
      action: 'read',
      description: 'Visualizar recorrências',
      moduleLabel: 'Recorrências',
      moduleDescription:
        'Lançamentos automáticos de contas fixas como aluguel, assinaturas e parcelas recorrentes.',
      moduleIcon: 'autorenew',
      actionLabel: 'Visualizar',
      detailedDescription:
        'Permite visualizar a lista de recorrências ativas, pausadas e finalizadas.',
    },
    {
      module: 'recurring',
      action: 'update',
      description: 'Editar recorrências',
      moduleLabel: 'Recorrências',
      moduleDescription:
        'Lançamentos automáticos de contas fixas como aluguel, assinaturas e parcelas recorrentes.',
      moduleIcon: 'autorenew',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar recorrências: valor, frequência, conta vinculada.',
    },
    {
      module: 'recurring',
      action: 'delete',
      description: 'Excluir recorrências',
      moduleLabel: 'Recorrências',
      moduleDescription:
        'Lançamentos automáticos de contas fixas como aluguel, assinaturas e parcelas recorrentes.',
      moduleIcon: 'autorenew',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite cancelar transações recorrentes permanentemente.',
    },
    // ===== family (4) =====
    {
      module: 'family',
      action: 'create',
      description: 'Criar família',
      moduleLabel: 'Família',
      moduleDescription:
        'Configurações da família: nome, dados gerais e preferências do grupo familiar.',
      moduleIcon: 'home',
      actionLabel: 'Criar',
      detailedDescription: 'Permite criar uma nova família no sistema.',
    },
    {
      module: 'family',
      action: 'read',
      description: 'Visualizar família',
      moduleLabel: 'Família',
      moduleDescription:
        'Configurações da família: nome, dados gerais e preferências do grupo familiar.',
      moduleIcon: 'home',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar informações e configurações da família.',
    },
    {
      module: 'family',
      action: 'update',
      description: 'Editar família',
      moduleLabel: 'Família',
      moduleDescription:
        'Configurações da família: nome, dados gerais e preferências do grupo familiar.',
      moduleIcon: 'home',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar o nome e configurações da família.',
    },
    {
      module: 'family',
      action: 'delete',
      description: 'Excluir família',
      moduleLabel: 'Família',
      moduleDescription:
        'Configurações da família: nome, dados gerais e preferências do grupo familiar.',
      moduleIcon: 'home',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite excluir a família e todos os seus dados. Ação irreversível.',
    },
    // ===== members (7) =====
    {
      module: 'members',
      action: 'create',
      description: 'Criar membros',
      moduleLabel: 'Membros',
      moduleDescription:
        'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
      moduleIcon: 'people',
      actionLabel: 'Criar',
      detailedDescription: 'Permite adicionar novos membros à família.',
    },
    {
      module: 'members',
      action: 'read',
      description: 'Visualizar membros',
      moduleLabel: 'Membros',
      moduleDescription:
        'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
      moduleIcon: 'people',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar a lista de membros, seus grupos e status.',
    },
    {
      module: 'members',
      action: 'update',
      description: 'Editar membros',
      moduleLabel: 'Membros',
      moduleDescription:
        'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
      moduleIcon: 'people',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar informações dos membros da família.',
    },
    {
      module: 'members',
      action: 'delete',
      description: 'Excluir membros',
      moduleLabel: 'Membros',
      moduleDescription:
        'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
      moduleIcon: 'people',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite remover membros da família permanentemente.',
    },
    {
      module: 'members',
      action: 'invite',
      description: 'Convidar membros',
      moduleLabel: 'Membros',
      moduleDescription:
        'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
      moduleIcon: 'people',
      actionLabel: 'Convidar',
      detailedDescription:
        'Permite enviar convites por email para novos membros ingressarem na família.',
    },
    {
      module: 'members',
      action: 'remove',
      description: 'Remover membros',
      moduleLabel: 'Membros',
      moduleDescription:
        'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
      moduleIcon: 'people',
      actionLabel: 'Remover',
      detailedDescription: 'Permite desvincullar um membro da família sem excluir sua conta.',
    },
    {
      module: 'members',
      action: 'change_group',
      description: 'Alterar grupo de membros',
      moduleLabel: 'Membros',
      moduleDescription:
        'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
      moduleIcon: 'people',
      actionLabel: 'Alterar Grupo',
      detailedDescription:
        'Permite alterar o grupo de permissão de um membro (ex: de Dependente para Membro).',
    },
    // ===== groups (4) =====
    {
      module: 'groups',
      action: 'create',
      description: 'Criar grupos de permissão',
      moduleLabel: 'Grupos',
      moduleDescription:
        'Criação e edição de grupos de permissão que definem o que cada tipo de membro pode fazer no sistema.',
      moduleIcon: 'admin_panel_settings',
      actionLabel: 'Criar',
      detailedDescription: 'Permite criar novos grupos de permissão personalizados.',
    },
    {
      module: 'groups',
      action: 'read',
      description: 'Visualizar grupos de permissão',
      moduleLabel: 'Grupos',
      moduleDescription:
        'Criação e edição de grupos de permissão que definem o que cada tipo de membro pode fazer no sistema.',
      moduleIcon: 'admin_panel_settings',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar a lista de grupos e suas configurações.',
    },
    {
      module: 'groups',
      action: 'update',
      description: 'Editar grupos de permissão',
      moduleLabel: 'Grupos',
      moduleDescription:
        'Criação e edição de grupos de permissão que definem o que cada tipo de membro pode fazer no sistema.',
      moduleIcon: 'admin_panel_settings',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar grupos e suas permissões na matriz de permissões.',
    },
    {
      module: 'groups',
      action: 'delete',
      description: 'Excluir grupos de permissão',
      moduleLabel: 'Grupos',
      moduleDescription:
        'Criação e edição de grupos de permissão que definem o que cada tipo de membro pode fazer no sistema.',
      moduleIcon: 'admin_panel_settings',
      actionLabel: 'Excluir',
      detailedDescription:
        'Permite excluir grupos personalizados. Grupos padrão não podem ser removidos.',
    },
    // ===== billing (5) =====
    {
      module: 'billing',
      action: 'create',
      description: 'Criar cobranças',
      moduleLabel: 'Assinatura',
      moduleDescription:
        'Gerenciamento da assinatura, pagamentos, plano atual e adição de novos membros pagos.',
      moduleIcon: 'credit_card',
      actionLabel: 'Criar',
      detailedDescription: 'Permite iniciar novas cobranças e checkout de membros adicionais.',
    },
    {
      module: 'billing',
      action: 'read',
      description: 'Visualizar cobranças',
      moduleLabel: 'Assinatura',
      moduleDescription:
        'Gerenciamento da assinatura, pagamentos, plano atual e adição de novos membros pagos.',
      moduleIcon: 'credit_card',
      actionLabel: 'Visualizar',
      detailedDescription:
        'Permite visualizar o plano atual, histórico de pagamentos e status da assinatura.',
    },
    {
      module: 'billing',
      action: 'update',
      description: 'Editar cobranças',
      moduleLabel: 'Assinatura',
      moduleDescription:
        'Gerenciamento da assinatura, pagamentos, plano atual e adição de novos membros pagos.',
      moduleIcon: 'credit_card',
      actionLabel: 'Editar',
      detailedDescription: 'Permite alterar o plano de assinatura.',
    },
    {
      module: 'billing',
      action: 'delete',
      description: 'Excluir cobranças',
      moduleLabel: 'Assinatura',
      moduleDescription:
        'Gerenciamento da assinatura, pagamentos, plano atual e adição de novos membros pagos.',
      moduleIcon: 'credit_card',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite cancelar cobranças pendentes.',
    },
    {
      module: 'billing',
      action: 'manage',
      description: 'Gerenciar assinatura e pagamentos',
      moduleLabel: 'Assinatura',
      moduleDescription:
        'Gerenciamento da assinatura, pagamentos, plano atual e adição de novos membros pagos.',
      moduleIcon: 'credit_card',
      actionLabel: 'Gerenciar',
      detailedDescription:
        'Permite gerenciar a assinatura completa: upgrade, downgrade, cancelamento e reativação.',
    },
    // ===== reports (4) =====
    {
      module: 'reports',
      action: 'create',
      description: 'Criar relatórios',
      moduleLabel: 'Relatórios',
      moduleDescription:
        'Relatórios financeiros com gráficos, resumos e exportação de dados para análise.',
      moduleIcon: 'assessment',
      actionLabel: 'Criar',
      detailedDescription: 'Permite gerar novos relatórios financeiros.',
    },
    {
      module: 'reports',
      action: 'read',
      description: 'Visualizar relatórios',
      moduleLabel: 'Relatórios',
      moduleDescription:
        'Relatórios financeiros com gráficos, resumos e exportação de dados para análise.',
      moduleIcon: 'assessment',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar relatórios e dashboards com gráficos.',
    },
    {
      module: 'reports',
      action: 'update',
      description: 'Editar relatórios',
      moduleLabel: 'Relatórios',
      moduleDescription:
        'Relatórios financeiros com gráficos, resumos e exportação de dados para análise.',
      moduleIcon: 'assessment',
      actionLabel: 'Editar',
      detailedDescription: 'Permite editar configurações de relatórios salvos.',
    },
    {
      module: 'reports',
      action: 'delete',
      description: 'Excluir relatórios',
      moduleLabel: 'Relatórios',
      moduleDescription:
        'Relatórios financeiros com gráficos, resumos e exportação de dados para análise.',
      moduleIcon: 'assessment',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite excluir relatórios salvos.',
    },
    // ===== notifications (5) =====
    {
      module: 'notifications',
      action: 'create',
      description: 'Criar notificações',
      moduleLabel: 'Notificações',
      moduleDescription:
        'Configuração de alertas e notificações do sistema: orçamento excedido, contas vencendo, metas atingidas.',
      moduleIcon: 'notifications',
      actionLabel: 'Criar',
      detailedDescription: 'Permite criar notificações manuais para membros da família.',
    },
    {
      module: 'notifications',
      action: 'read',
      description: 'Visualizar notificações',
      moduleLabel: 'Notificações',
      moduleDescription:
        'Configuração de alertas e notificações do sistema: orçamento excedido, contas vencendo, metas atingidas.',
      moduleIcon: 'notifications',
      actionLabel: 'Visualizar',
      detailedDescription: 'Permite visualizar as notificações recebidas.',
    },
    {
      module: 'notifications',
      action: 'update',
      description: 'Editar notificações',
      moduleLabel: 'Notificações',
      moduleDescription:
        'Configuração de alertas e notificações do sistema: orçamento excedido, contas vencendo, metas atingidas.',
      moduleIcon: 'notifications',
      actionLabel: 'Editar',
      detailedDescription: 'Permite marcar notificações como lidas e gerenciar preferências.',
    },
    {
      module: 'notifications',
      action: 'delete',
      description: 'Excluir notificações',
      moduleLabel: 'Notificações',
      moduleDescription:
        'Configuração de alertas e notificações do sistema: orçamento excedido, contas vencendo, metas atingidas.',
      moduleIcon: 'notifications',
      actionLabel: 'Excluir',
      detailedDescription: 'Permite excluir notificações do histórico.',
    },
    {
      module: 'notifications',
      action: 'manage',
      description: 'Gerenciar configurações de notificação',
      moduleLabel: 'Notificações',
      moduleDescription:
        'Configuração de alertas e notificações do sistema: orçamento excedido, contas vencendo, metas atingidas.',
      moduleIcon: 'notifications',
      actionLabel: 'Gerenciar',
      detailedDescription:
        'Permite configurar quais tipos de alerta cada membro recebe (orçamento, metas, contas).',
    },
  ];
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
        moduleLabel: perm.moduleLabel,
        moduleDescription: perm.moduleDescription,
        moduleIcon: perm.moduleIcon,
        actionLabel: perm.actionLabel,
        detailedDescription: perm.detailedDescription,
      },
      create: {
        module: perm.module,
        action: perm.action,
        description: perm.description,
        moduleLabel: perm.moduleLabel,
        moduleDescription: perm.moduleDescription,
        moduleIcon: perm.moduleIcon,
        actionLabel: perm.actionLabel,
        detailedDescription: perm.detailedDescription,
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
    return keys.map((k) => permMap.get(k)).filter((id): id is string => id !== undefined);
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
    'accounts:create',
    'accounts:read',
    'accounts:update',
    'accounts:delete',
    // Transacoes
    'transactions:create',
    'transactions:read',
    'transactions:update',
    'transactions:delete',
    // Categorias
    'categories:create',
    'categories:read',
    'categories:update',
    'categories:delete',
    // Orcamentos
    'budgets:create',
    'budgets:read',
    'budgets:update',
    'budgets:delete',
    // Metas de economia
    'savings_goals:create',
    'savings_goals:read',
    'savings_goals:update',
    'savings_goals:delete',
    // Recorrencias
    'recurring:create',
    'recurring:read',
    'recurring:update',
    'recurring:delete',
    // Relatorios (somente leitura)
    'reports:read',
    // Notificacoes (leitura + manage)
    'notifications:read',
    'notifications:manage',
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
