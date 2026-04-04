// Validadores compartilhados entre API e Web

import { VALIDATION } from '../constants';

/**
 * Valida se um email tem formato correto
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se uma senha atende os requisitos mínimos
 */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= VALIDATION.PASSWORD_MIN_LENGTH &&
    password.length <= VALIDATION.PASSWORD_MAX_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

/**
 * Valida se um valor monetário é positivo
 */
export function isPositiveAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}
