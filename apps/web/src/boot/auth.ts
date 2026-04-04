import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth.store'
import { useRbacStore } from 'src/stores/rbac.store'

export default boot(async ({ router }) => {
  const authStore = useAuthStore()
  const rbacStore = useRbacStore()

  // Load tokens and user from localStorage
  authStore.loadFromStorage()
  rbacStore.loadFromStorage()

  // If we have a refresh token, try to refresh the session
  if (authStore.refreshToken) {
    try {
      await authStore.refreshTokenAction()
      // Token refreshed successfully — session is valid
    } catch {
      // Refresh failed — clear everything and let guards redirect to login
      authStore.clearAuth()
      rbacStore.clearPermissions()

      // Only redirect if current route requires auth
      const currentPath = window.location.pathname
      const publicPaths = ['/login', '/register', '/forgot-password']
      if (!publicPaths.some((p) => currentPath.startsWith(p))) {
        await router.push('/login')
      }
    }
  }
})
