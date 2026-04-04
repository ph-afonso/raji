// Constantes compartilhadas entre API e Web

export const APP_NAME = 'Raji Finance';
export const APP_VERSION = '0.1.0';

// Limites de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
} as const;

// Limites de validação
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
} as const;

// Moeda padrão
export const DEFAULT_CURRENCY = 'BRL';
export const DEFAULT_LOCALE = 'pt-BR';
