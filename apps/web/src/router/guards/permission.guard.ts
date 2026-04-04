import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useRbacStore } from 'src/stores/rbac.store'

export function permissionGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const rbacStore = useRbacStore()

  const requiredPermission = to.meta.permission as string | undefined

  if (requiredPermission && !rbacStore.hasPermission(requiredPermission)) {
    next('/forbidden')
    return
  }

  next()
}
