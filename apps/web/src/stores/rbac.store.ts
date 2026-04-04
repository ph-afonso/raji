import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Permission } from 'src/types/auth';

const STORAGE_KEY = 'raji_permissions';

// Normaliza permissoes — aceita tanto strings ("module:action") quanto objetos ({ module, action })
function normalizePermissions(perms: (string | Permission)[]): Permission[] {
  return perms.map((p) => {
    if (typeof p === 'string') {
      const [module, action] = p.split(':');
      return { module, action };
    }
    return p;
  });
}

export const useRbacStore = defineStore('rbac', () => {
  // State
  const permissions = ref<Permission[]>([]);

  // Actions
  function loadPermissions(perms: (string | Permission)[]) {
    permissions.value = normalizePermissions(perms);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions.value));
  }

  function clearPermissions() {
    permissions.value = [];
    localStorage.removeItem(STORAGE_KEY);
  }

  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        permissions.value = normalizePermissions(parsed);
      } catch {
        permissions.value = [];
      }
    }
  }

  // Getters (as functions since they take params)
  function hasPermission(permission: string): boolean {
    const [module, action] = permission.split(':');
    return permissions.value.some((p) => p.module === module && p.action === action);
  }

  return {
    permissions,
    loadPermissions,
    clearPermissions,
    loadFromStorage,
    hasPermission,
  };
});
