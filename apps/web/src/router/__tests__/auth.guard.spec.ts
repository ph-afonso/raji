import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authGuard } from '../guards/auth.guard';
import { useAuthStore } from 'src/stores/auth.store';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

function createMockRoute(
  overrides: Partial<RouteLocationNormalized> = {},
): RouteLocationNormalized {
  return {
    path: '/',
    name: undefined,
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    meta: {},
    redirectedFrom: undefined,
    ...overrides,
  } as RouteLocationNormalized;
}

describe('Auth Guard', () => {
  let authStore: ReturnType<typeof useAuthStore>;
  let next: NavigationGuardNext;

  beforeEach(() => {
    authStore = useAuthStore();
    next = vi.fn() as unknown as NavigationGuardNext;
  });

  it('deve redirecionar para /login quando rota requer auth e usuario nao autenticado', () => {
    const to = createMockRoute({
      fullPath: '/dashboard',
      matched: [{ meta: { requiresAuth: true } } as any],
    });
    const from = createMockRoute();

    authGuard(to, from, next);

    expect(next).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/dashboard' },
    });
  });

  it('deve permitir acesso quando rota requer auth e usuario esta autenticado', () => {
    authStore.setTokens('valid-token', 'valid-refresh');

    const to = createMockRoute({
      matched: [{ meta: { requiresAuth: true } } as any],
    });
    const from = createMockRoute();

    authGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deve redirecionar para /dashboard quando rota e guestOnly e usuario esta autenticado', () => {
    authStore.setTokens('valid-token', 'valid-refresh');

    const to = createMockRoute({
      matched: [{ meta: { guestOnly: true } } as any],
    });
    const from = createMockRoute();

    authGuard(to, from, next);

    expect(next).toHaveBeenCalledWith('/dashboard');
  });

  it('deve permitir acesso quando rota e guestOnly e usuario nao esta autenticado', () => {
    const to = createMockRoute({
      matched: [{ meta: { guestOnly: true } } as any],
    });
    const from = createMockRoute();

    authGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deve permitir acesso quando rota nao tem restricoes', () => {
    const to = createMockRoute({
      matched: [{ meta: {} } as any],
    });
    const from = createMockRoute();

    authGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });
});
