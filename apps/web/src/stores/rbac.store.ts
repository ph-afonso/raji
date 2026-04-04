import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Permission } from 'src/types/auth'

const STORAGE_KEY = 'raji_permissions'

export const useRbacStore = defineStore('rbac', () => {
  // State
  const permissions = ref<Permission[]>([])

  // Actions
  function loadPermissions(perms: Permission[]) {
    permissions.value = perms
    localStorage.setItem(STORAGE_KEY, JSON.stringify(perms))
  }

  function clearPermissions() {
    permissions.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        permissions.value = JSON.parse(stored)
      } catch {
        permissions.value = []
      }
    }
  }

  // Getters (as functions since they take params)
  function hasPermission(permission: string): boolean {
    const [module, action] = permission.split(':')
    return permissions.value.some(
      (p) => p.module === module && p.action === action,
    )
  }

  return {
    permissions,
    loadPermissions,
    clearPermissions,
    loadFromStorage,
    hasPermission,
  }
})
