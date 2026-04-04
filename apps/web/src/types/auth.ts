export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  familyId: string
  groupId: string
  isFamilyOwner: boolean
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  familyName: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  permissions?: Permission[]
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface Permission {
  module: string
  action: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    page: number
    perPage: number
    total: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}
