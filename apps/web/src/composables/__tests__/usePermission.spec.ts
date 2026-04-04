import { describe, it, expect, beforeEach } from 'vitest';
import { usePermission } from '../usePermission';
import { useRbacStore } from 'src/stores/rbac.store';
import type { Permission } from 'src/types/auth';

const mockPermissions: Permission[] = [
  { module: 'transactions', action: 'create' },
  { module: 'groups', action: 'read' },
];

describe('usePermission composable', () => {
  let rbacStore: ReturnType<typeof useRbacStore>;

  beforeEach(() => {
    rbacStore = useRbacStore();
    rbacStore.loadPermissions(mockPermissions);
  });

  describe('hasPermission()', () => {
    it('deve delegar para rbacStore.hasPermission e retornar true', () => {
      const { hasPermission } = usePermission();

      expect(hasPermission('transactions:create')).toBe(true);
    });

    it('deve retornar false quando permissao nao existe', () => {
      const { hasPermission } = usePermission();

      expect(hasPermission('billing:manage')).toBe(false);
    });
  });

  describe('canAccess()', () => {
    it('deve retornar true se pelo menos uma permissao existe', () => {
      const { canAccess } = usePermission();

      expect(canAccess(['billing:manage', 'transactions:create'])).toBe(true);
    });

    it('deve retornar false se nenhuma permissao existe', () => {
      const { canAccess } = usePermission();

      expect(canAccess(['billing:manage', 'admin:delete'])).toBe(false);
    });

    it('deve retornar false para array vazio', () => {
      const { canAccess } = usePermission();

      expect(canAccess([])).toBe(false);
    });
  });
});
