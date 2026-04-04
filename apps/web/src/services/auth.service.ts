import api from './api'
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  RefreshResponse,
  ApiResponse,
} from 'src/types/auth'

export const authService = {
  async login(dto: LoginDto): Promise<ApiResponse<AuthResponse>> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      dto,
    )
    return data
  },

  async register(dto: RegisterDto): Promise<ApiResponse<AuthResponse>> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      dto,
    )
    return data
  },

  async refreshToken(token: string): Promise<ApiResponse<RefreshResponse>> {
    const { data } = await api.post<ApiResponse<RefreshResponse>>(
      '/auth/refresh',
      { refreshToken: token },
    )
    return data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}

export default authService
