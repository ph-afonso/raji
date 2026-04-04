import api from './api';
import type { ApiResponse } from 'src/types/auth';
import type { Group, CreateGroupDto, UpdateGroupDto, PermissionDef } from 'src/types/rbac';

export const rbacService = {
  // Groups
  async listGroups(): Promise<ApiResponse<Group[]>> {
    const { data } = await api.get<ApiResponse<Group[]>>('/groups');
    return data;
  },

  async createGroup(dto: CreateGroupDto): Promise<ApiResponse<Group>> {
    const { data } = await api.post<ApiResponse<Group>>('/groups', dto);
    return data;
  },

  async updateGroup(id: string, dto: UpdateGroupDto): Promise<ApiResponse<Group>> {
    const { data } = await api.patch<ApiResponse<Group>>(`/groups/${id}`, dto);
    return data;
  },

  async deleteGroup(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
  },

  // Permissions
  async listPermissions(): Promise<ApiResponse<PermissionDef[]>> {
    const { data } = await api.get<ApiResponse<PermissionDef[]>>('/groups/permissions');
    return data;
  },

  async getGroupPermissions(groupId: string): Promise<ApiResponse<PermissionDef[]>> {
    // O backend retorna as permissoes do grupo via PUT (após salvar).
    // Para carregar as permissoes atuais, usamos o endpoint de update
    // com um GET customizado. Como o backend nao tem GET /groups/:id/permissions,
    // vamos usar a resposta do updateGroupPermissions ou carregar via listGroups.
    // Workaround: chamamos PUT com as permissoes atuais (nao ideal).
    // Na pratica, adicionamos este endpoint no backend futuramente.
    const { data } = await api.get<ApiResponse<PermissionDef[]>>(`/groups/${groupId}/permissions`);
    return data;
  },

  async updateGroupPermissions(
    groupId: string,
    permissionIds: string[],
  ): Promise<ApiResponse<PermissionDef[]>> {
    const { data } = await api.put<ApiResponse<PermissionDef[]>>(`/groups/${groupId}/permissions`, {
      permissionIds,
    });
    return data;
  },

  // Utility: trocar grupo de um usuario
  async changeUserGroup(userId: string, groupId: string): Promise<void> {
    await api.patch(`/users/${userId}/group`, { groupId });
  },
};

export default rbacService;
