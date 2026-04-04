// Traduções de módulos e ações do sistema RBAC
// Usado nas telas de permissões, grupos e em qualquer lugar que exiba nomes técnicos

export const moduleLabels: Record<string, string> = {
  accounts: 'Contas',
  transactions: 'Transações',
  categories: 'Categorias',
  budgets: 'Orçamentos',
  savings_goals: 'Metas de Economia',
  recurring: 'Recorrências',
  family: 'Família',
  members: 'Membros',
  groups: 'Grupos',
  billing: 'Assinatura',
  reports: 'Relatórios',
  notifications: 'Notificações',
};

export const actionLabels: Record<string, string> = {
  create: 'Criar',
  read: 'Visualizar',
  update: 'Editar',
  delete: 'Excluir',
  import: 'Importar',
  invite: 'Convidar',
  remove: 'Remover',
  change_group: 'Alterar Grupo',
  manage: 'Gerenciar',
};

export const groupLabels: Record<string, string> = {
  master: 'Administrador',
  'member-full': 'Membro',
  dependent: 'Dependente',
};

export const subscriptionStatusLabels: Record<string, string> = {
  TRIAL: 'Período de Teste',
  ACTIVE: 'Ativa',
  PAST_DUE: 'Pagamento Pendente',
  EXPIRED: 'Expirada',
  CANCELED: 'Cancelada',
};

export const accountTypeLabels: Record<string, string> = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Poupança',
  WALLET: 'Carteira',
  CREDIT_CARD: 'Cartão de Crédito',
  INVESTMENT: 'Investimento',
  OTHER: 'Outro',
};

export const transactionTypeLabels: Record<string, string> = {
  INCOME: 'Receita',
  EXPENSE: 'Despesa',
  TRANSFER: 'Transferência',
};

export const recurrenceFrequencyLabels: Record<string, string> = {
  DAILY: 'Diária',
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quinzenal',
  MONTHLY: 'Mensal',
  BIMONTHLY: 'Bimestral',
  QUARTERLY: 'Trimestral',
  SEMIANNUAL: 'Semestral',
  ANNUAL: 'Anual',
};

// Descrições detalhadas dos módulos (botão ? no accordion)
export const moduleDescriptions: Record<string, string> = {
  accounts:
    'Gerenciamento de contas bancárias, carteiras e cartões de crédito. Inclui saldos e configurações de cada conta.',
  transactions:
    'Registro de movimentações financeiras: receitas, despesas e transferências entre contas.',
  categories:
    'Organização dos gastos em categorias e subcategorias para classificar lançamentos (ex: Alimentação > Restaurante).',
  budgets:
    'Definição de limites de gastos mensais por categoria, com alertas quando o orçamento está próximo do limite.',
  savings_goals:
    'Metas de economia familiar com acompanhamento de progresso e contribuições (ex: Viagem, Reserva de Emergência).',
  recurring:
    'Lançamentos automáticos de contas fixas como aluguel, assinaturas e parcelas recorrentes.',
  family: 'Configurações da família: nome, dados gerais e preferências do grupo familiar.',
  members:
    'Gerenciamento dos membros da família: convidar, remover e alterar o grupo de permissão de cada pessoa.',
  groups:
    'Criação e edição de grupos de permissão que definem o que cada tipo de membro pode fazer no sistema.',
  billing: 'Gerenciamento da assinatura, pagamentos, plano atual e adição de novos membros pagos.',
  reports: 'Relatórios financeiros com gráficos, resumos e exportação de dados para análise.',
  notifications:
    'Configuração de alertas e notificações do sistema: orçamento excedido, contas vencendo, metas atingidas.',
};

// Descrições detalhadas das ações por módulo (botão ? em cada permissão)
export const actionDescriptionsByModule: Record<string, Record<string, string>> = {
  accounts: {
    create: 'Permite cadastrar novas contas bancárias, carteiras ou cartões de crédito no sistema.',
    read: 'Permite visualizar a lista de contas, saldos e detalhes de cada conta.',
    update: 'Permite editar informações das contas como nome, tipo, cor e limites.',
    delete: 'Permite excluir contas do sistema. Contas com transações serão desativadas.',
  },
  transactions: {
    create: 'Permite registrar novas receitas, despesas ou transferências entre contas.',
    read: 'Permite visualizar a lista de transações, filtrar por período, conta e categoria.',
    update: 'Permite editar transações existentes: valor, data, categoria ou descrição.',
    delete: 'Permite excluir transações. O saldo da conta será recalculado automaticamente.',
    import:
      'Permite importar extratos bancários nos formatos CSV e OFX para lançamento automático.',
  },
  categories: {
    create: 'Permite criar novas categorias e subcategorias de gastos.',
    read: 'Permite visualizar a árvore de categorias do sistema.',
    update: 'Permite editar nomes, ícones e cores das categorias.',
    delete:
      'Permite excluir categorias customizadas. Categorias do sistema não podem ser removidas.',
  },
  budgets: {
    create: 'Permite definir novos limites de orçamento mensal por categoria.',
    read: 'Permite visualizar os orçamentos e o progresso de gastos em cada categoria.',
    update: 'Permite alterar os valores e alertas dos orçamentos existentes.',
    delete: 'Permite remover orçamentos de categorias.',
  },
  savings_goals: {
    create: 'Permite criar novas metas de economia com valor alvo e data limite.',
    read: 'Permite visualizar metas, progresso e histórico de contribuições.',
    update: 'Permite editar metas: nome, valor alvo, data e descrição.',
    delete: 'Permite excluir metas de economia e seus registros de contribuição.',
  },
  recurring: {
    create: 'Permite cadastrar novas transações recorrentes (ex: aluguel mensal, assinatura).',
    read: 'Permite visualizar a lista de recorrências ativas, pausadas e finalizadas.',
    update: 'Permite editar recorrências: valor, frequência, conta vinculada.',
    delete: 'Permite cancelar transações recorrentes permanentemente.',
  },
  family: {
    create: 'Permite criar uma nova família no sistema.',
    read: 'Permite visualizar informações e configurações da família.',
    update: 'Permite editar o nome e configurações da família.',
    delete: 'Permite excluir a família e todos os seus dados. Ação irreversível.',
  },
  members: {
    create: 'Permite adicionar novos membros à família.',
    read: 'Permite visualizar a lista de membros, seus grupos e status.',
    update: 'Permite editar informações dos membros da família.',
    delete: 'Permite remover membros da família permanentemente.',
    invite: 'Permite enviar convites por email para novos membros ingressarem na família.',
    remove: 'Permite desvincullar um membro da família sem excluir sua conta.',
    change_group:
      'Permite alterar o grupo de permissão de um membro (ex: de Dependente para Membro).',
  },
  groups: {
    create: 'Permite criar novos grupos de permissão personalizados.',
    read: 'Permite visualizar a lista de grupos e suas configurações.',
    update: 'Permite editar grupos e suas permissões na matriz de permissões.',
    delete: 'Permite excluir grupos personalizados. Grupos padrão não podem ser removidos.',
  },
  billing: {
    create: 'Permite iniciar novas cobranças e checkout de membros adicionais.',
    read: 'Permite visualizar o plano atual, histórico de pagamentos e status da assinatura.',
    update: 'Permite alterar o plano de assinatura.',
    delete: 'Permite cancelar cobranças pendentes.',
    manage:
      'Permite gerenciar a assinatura completa: upgrade, downgrade, cancelamento e reativação.',
  },
  reports: {
    create: 'Permite gerar novos relatórios financeiros.',
    read: 'Permite visualizar relatórios e dashboards com gráficos.',
    update: 'Permite editar configurações de relatórios salvos.',
    delete: 'Permite excluir relatórios salvos.',
  },
  notifications: {
    create: 'Permite criar notificações manuais para membros da família.',
    read: 'Permite visualizar as notificações recebidas.',
    update: 'Permite marcar notificações como lidas e gerenciar preferências.',
    delete: 'Permite excluir notificações do histórico.',
    manage:
      'Permite configurar quais tipos de alerta cada membro recebe (orçamento, metas, contas).',
  },
};

// Helper genérico — retorna a tradução ou o valor original capitalizado
export function t(key: string, labels: Record<string, string>): string {
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

// Helpers específicos
export function tModule(key: string): string {
  return t(key, moduleLabels);
}

export function tAction(key: string): string {
  return t(key, actionLabels);
}

export function tGroup(slug: string): string {
  return t(slug, groupLabels);
}
