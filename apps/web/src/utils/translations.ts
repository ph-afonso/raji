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
