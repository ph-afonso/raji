import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Router from 'src/router'

const api: AxiosInstance = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent infinite refresh loops
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Dynamically import to avoid circular deps — read token from localStorage
    const accessToken = localStorage.getItem('raji_access_token')
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: handle 401 refresh + 403 paywall
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 403 — subscription required
    if (error.response?.status === 403) {
      const code = error.response.data?.error?.code
      if (
        code === 'SUBSCRIPTION_REQUIRED' ||
        code === 'SUBSCRIPTION_INACTIVE'
      ) {
        await Router.push('/paywall')
        return Promise.reject(error)
      }
    }

    // Handle 401 — try token refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('raji_refresh_token')
      if (!refreshToken) {
        isRefreshing = false
        processQueue(error, null)
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken },
        )

        const newAccessToken = data.data.accessToken
        const newRefreshToken = data.data.refreshToken

        localStorage.setItem('raji_access_token', newAccessToken)
        localStorage.setItem('raji_refresh_token', newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('raji_access_token')
        localStorage.removeItem('raji_refresh_token')
        localStorage.removeItem('raji_user')
        await Router.push('/login')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export { api }
export default api
