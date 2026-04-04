import { describe, it, expect, vi, beforeEach } from 'vitest';
import { permissionGuard } from '../guards/permission.guard';
import { useRbacStore } from 'src/stores/rbac.store';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import type { Permission } from 'src/types/auth';

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

const mockPermissions: Permission[] = [
  { module: 'groups', action: 'read' },
  { module: 'transactions', action: 'create' },
];

describe('Permission Guard', () => {
  let rbacStore: ReturnType<typeof useRbacStore>;
  let next: NavigationGuardNext;

  beforeEach(() => {
    rbacStore = useRbacStore();
    next = vi.fn() as unknown as NavigationGuardNext;
  });

  it('deve permitir acesso quando usuario tem a permissao requerida', () => {
    rbacStore.loadPermissions(mockPermissions);

    const to = createMockRoute({
      meta: { permission: 'groups:read' },
    });
    const from = createMockRoute();

    permissionGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deve redirecionar para /forbidden quando usuario nao tem a permissao', () => {
    rbacStore.loadPermissions(mockPermissions);

    const to = createMockRoute({
      meta: { permission: 'billing:manage' },
    });
    const from = createMockRoute();

    permissionGuard(to, from, next);

    expect(next).toHaveBeenCalledWith('/forbidden');
  });

  it('deve permitir acesso quando rota nao requer permissao', () => {
    const to = createMockRoute({
      meta: {},
    });
    const from = createMockRoute();

    permissionGuard(to, from, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('deve redirecionar quando usuario nao tem nenhuma permissao carregada', () => {
    // rbacStore.permissions vazio por default

    const to = createMockRoute({
      meta: { permission: 'groups:read' },
    });
    const from = createMockRoute();

    permissionGuard(to, from, next);

    expect(next).toHaveBeenCalledWith('/forbidden');
  });
});
