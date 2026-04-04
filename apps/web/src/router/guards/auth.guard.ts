import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from 'src/stores/auth.store'

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (requiresAuth && !authStore.isAuthenticated) {
    // Not logged in — redirect to login with intended destination
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  if (isGuestOnly && authStore.isAuthenticated) {
    // Already logged in — redirect to dashboard
    next('/dashboard')
    return
  }

  next()
}
