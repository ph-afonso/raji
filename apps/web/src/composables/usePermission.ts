import { useRbacStore } from 'src/stores/rbac.store'

export function usePermission() {
  const rbacStore = useRbacStore()

  function hasPermission(perm: string): boolean {
    return rbacStore.hasPermission(perm)
  }

  function canAccess(perms: string[]): boolean {
    return perms.some((p) => hasPermission(p))
  }

  return {
    hasPermission,
    canAccess,
  }
}
