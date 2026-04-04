import api from './api'
import type { ApiResponse } from 'src/types/auth'
import type {
  Group,
  CreateGroupDto,
  UpdateGroupDto,
  PermissionDef,
} from 'src/types/rbac'

export const rbacService = {
  // Groups
  async listGroups(): Promise<ApiResponse<Group[]>> {
    const { data } = await api.get<ApiResponse<Group[]>>('/groups')
    return data
  },

  async createGroup(dto: CreateGroupDto): Promise<ApiResponse<Group>> {
    const { data } = await api.post<ApiResponse<Group>>('/groups', dto)
    return data
  },

  async updateGroup(
    id: string,
    dto: UpdateGroupDto,
  ): Promise<ApiResponse<Group>> {
    const { data } = await api.patch<ApiResponse<Group>>(`/groups/${id}`, dto)
    return data
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`)
  },

  // Permissions
  async listPermissions(): Promise<ApiResponse<PermissionDef[]>> {
    const { data } = await api.get<ApiResponse<PermissionDef[]>>(
      '/permissions',
    )
    return data
  },

  async updateGroupPermissions(
    groupId: string,
    permissions: string[],
  ): Promise<void> {
    await api.put(`/groups/${groupId}/permissions`, { permissions })
  },
}

export default rbacService
