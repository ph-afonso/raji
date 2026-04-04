import { describe, it, expect, beforeEach } from 'vitest';
import { useRbacStore } from '../rbac.store';
import type { Permission } from 'src/types/auth';

const mockPermissions: Permission[] = [
  { module: 'transactions', action: 'create' },
  { module: 'transactions', action: 'read' },
  { module: 'groups', action: 'read' },
];

describe('RBAC Store', () => {
  let rbacStore: ReturnType<typeof useRbacStore>;

  beforeEach(() => {
    rbacStore = useRbacStore();
  });

  describe('loadPermissions()', () => {
    it('deve carregar array de permissoes no state', () => {
      rbacStore.loadPermissions(mockPermissions);

      expect(rbacStore.permissions).toEqual(mockPermissions);
      expect(rbacStore.permissions).toHaveLength(3);
    });

    it('deve salvar permissoes no localStorage', () => {
      rbacStore.loadPermissions(mockPermissions);

      const stored = localStorage.getItem('raji_permissions');
      expect(stored).toBe(JSON.stringify(mockPermissions));
    });
  });

  describe('clearPermissions()', () => {
    it('deve limpar permissoes do state e localStorage', () => {
      rbacStore.loadPermissions(mockPermissions);

      rbacStore.clearPermissions();

      expect(rbacStore.permissions).toEqual([]);
      expect(localStorage.getItem('raji_permissions')).toBeNull();
    });
  });

  describe('hasPermission()', () => {
    beforeEach(() => {
      rbacStore.loadPermissions(mockPermissions);
    });

    it('deve retornar true quando permissao existe', () => {
      expect(rbacStore.hasPermission('transactions:create')).toBe(true);
    });

    it('deve retornar false quando permissao nao existe', () => {
      expect(rbacStore.hasPermission('billing:manage')).toBe(false);
    });

    it('deve retornar false para modulo correto mas action incorreta', () => {
      expect(rbacStore.hasPermission('transactions:delete')).toBe(false);
    });
  });

  describe('loadFromStorage()', () => {
    it('deve carregar permissoes do localStorage para o state', () => {
      localStorage.setItem('raji_permissions', JSON.stringify(mockPermissions));

      rbacStore.loadFromStorage();

      expect(rbacStore.permissions).toEqual(mockPermissions);
    });

    it('deve manter array vazio quando localStorage esta vazio', () => {
      rbacStore.loadFromStorage();

      expect(rbacStore.permissions).toEqual([]);
    });

    it('deve tratar JSON invalido graciosamente', () => {
      localStorage.setItem('raji_permissions', 'not-valid-json{{');

      rbacStore.loadFromStorage();

      expect(rbacStore.permissions).toEqual([]);
    });
  });
});
