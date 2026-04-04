import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginDto, RegisterDto, Permission } from 'src/types/auth'
import authService from 'src/services/auth.service'
import { useRbacStore } from './rbac.store'

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'raji_access_token',
  REFRESH_TOKEN: 'raji_refresh_token',
  USER: 'raji_user',
} as const

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<User | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value)
  const currentUser = computed(() => user.value)

  // Actions
  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh)
  }

  function setUser(u: User) {
    user.value = u
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u))
  }

  function clearAuth() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)

    const rbacStore = useRbacStore()
    rbacStore.clearPermissions()
  }

  async function login(email: string, password: string) {
    const response = await authService.login({ email, password } as LoginDto)
    const { accessToken: at, refreshToken: rt, user: u, permissions } = response.data

    setTokens(at, rt)
    setUser(u)

    if (permissions) {
      const rbacStore = useRbacStore()
      rbacStore.loadPermissions(permissions)
    }
  }

  async function register(data: RegisterDto) {
    const response = await authService.register(data)
    const { accessToken: at, refreshToken: rt, user: u } = response.data

    setTokens(at, rt)
    setUser(u)
  }

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // Ignore logout API errors — clear local state regardless
    }
    clearAuth()
  }

  async function refreshTokenAction() {
    const rt = refreshToken.value || localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    if (!rt) throw new Error('No refresh token available')

    const response = await authService.refreshToken(rt)
    setTokens(response.data.accessToken, response.data.refreshToken)
  }

  function loadFromStorage() {
    const storedAccess = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const storedRefresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER)

    if (storedAccess) accessToken.value = storedAccess
    if (storedRefresh) refreshToken.value = storedRefresh
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        user.value = null
      }
    }
  }

  return {
    // State
    accessToken,
    refreshToken,
    user,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    login,
    register,
    logout,
    refreshTokenAction,
    loadFromStorage,
    clearAuth,
    setTokens,
    setUser,
  }
})
