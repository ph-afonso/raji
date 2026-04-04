import api from './api'
import type { ApiResponse, User } from 'src/types/auth'

export const usersService = {
  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await api.get<ApiResponse<User>>('/users/me')
    return data
  },

  async updateProfile(
    dto: Partial<Pick<User, 'name' | 'avatarUrl'>>,
  ): Promise<ApiResponse<User>> {
    const { data } = await api.patch<ApiResponse<User>>('/users/me', dto)
    return data
  },
}

export default usersService
