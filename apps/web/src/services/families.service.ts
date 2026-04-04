import api from './api';
import type { ApiResponse } from 'src/types/auth';

export interface Family {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    users: number;
  };
}

export interface FamilyMember {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isActive: boolean;
  isFamilyOwner: boolean;
  createdAt: string;
  group: {
    id: string;
    name: string;
    slug: string;
  };
}

export const familiesService = {
  async getMyFamily(): Promise<ApiResponse<Family>> {
    const { data } = await api.get<ApiResponse<Family>>('/families/me');
    return data;
  },

  async updateMyFamily(dto: { name: string }): Promise<ApiResponse<Family>> {
    const { data } = await api.patch<ApiResponse<Family>>('/families/me', dto);
    return data;
  },

  async listMembers(): Promise<ApiResponse<FamilyMember[]>> {
    const { data } = await api.get<ApiResponse<FamilyMember[]>>('/families/me/members');
    return data;
  },
};

export default familiesService;
