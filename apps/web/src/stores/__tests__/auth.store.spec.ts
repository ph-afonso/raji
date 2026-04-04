import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../auth.store';
import { useRbacStore } from '../rbac.store';
import type { User, Permission } from 'src/types/auth';

// Mock auth service
vi.mock('src/services/auth.service', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refreshToken: vi.fn(),
  },
}));

import authService from 'src/services/auth.service';

const mockUser: User = {
  id: '1',
  email: 'test@raji.com',
  name: 'Test User',
  avatarUrl: null,
  familyId: 'fam-1',
  groupId: 'grp-1',
  isFamilyOwner: true,
};

const mockPermissions: Permission[] = [
  { module: 'transactions', action: 'create' },
  { module: 'groups', action: 'read' },
];

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    authStore = useAuthStore();
  });

  describe('login()', () => {
    it('deve atualizar accessToken, refreshToken e user no state', async () => {
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        data: {
          accessToken: 'access-123',
          refreshToken: 'refresh-456',
          user: mockUser,
          permissions: mockPermissions,
        },
      });

      await authStore.login('test@raji.com', 'password123');

      expect(authStore.accessToken).toBe('access-123');
      expect(authStore.refreshToken).toBe('refresh-456');
      expect(authStore.user).toEqual(mockUser);
    });

    it('deve salvar tokens e user no localStorage', async () => {
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        data: {
          accessToken: 'access-123',
          refreshToken: 'refresh-456',
          user: mockUser,
          permissions: mockPermissions,
        },
      });

      await authStore.login('test@raji.com', 'password123');

      expect(localStorage.getItem('raji_access_token')).toBe('access-123');
      expect(localStorage.getItem('raji_refresh_token')).toBe('refresh-456');
      expect(localStorage.getItem('raji_user')).toBe(JSON.stringify(mockUser));
    });

    it('deve carregar permissoes no rbacStore quando retornadas', async () => {
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        data: {
          accessToken: 'access-123',
          refreshToken: 'refresh-456',
          user: mockUser,
          permissions: mockPermissions,
        },
      });

      await authStore.login('test@raji.com', 'password123');

      const rbacStore = useRbacStore();
      expect(rbacStore.permissions).toEqual(mockPermissions);
    });

    it('nao deve alterar state quando login falha', async () => {
      vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'));

      await expect(authStore.login('test@raji.com', 'wrong')).rejects.toThrow(
        'Invalid credentials',
      );

      expect(authStore.accessToken).toBeNull();
      expect(authStore.refreshToken).toBeNull();
      expect(authStore.user).toBeNull();
    });
  });

  describe('register()', () => {
    it('deve salvar tokens e user no state e localStorage', async () => {
      vi.mocked(authService.register).mockResolvedValue({
        success: true,
        data: {
          accessToken: 'reg-access-789',
          refreshToken: 'reg-refresh-012',
          user: mockUser,
        },
      });

      await authStore.register({
        name: 'Test User',
        email: 'test@raji.com',
        password: 'password123',
        familyName: 'Familia Test',
      });

      expect(authStore.accessToken).toBe('reg-access-789');
      expect(authStore.refreshToken).toBe('reg-refresh-012');
      expect(authStore.user).toEqual(mockUser);
      expect(localStorage.getItem('raji_access_token')).toBe('reg-access-789');
      expect(localStorage.getItem('raji_refresh_token')).toBe('reg-refresh-012');
    });
  });

  describe('logout()', () => {
    it('deve limpar state e localStorage', async () => {
      // Setup: simula estado logado
      vi.mocked(authService.login).mockResolvedValue({
        success: true,
        data: {
          accessToken: 'access-123',
          refreshToken: 'refresh-456',
          user: mockUser,
        },
      });
      await authStore.login('test@raji.com', 'password123');

      vi.mocked(authService.logout).mockResolvedValue(undefined);

      await authStore.logout();

      expect(authStore.accessToken).toBeNull();
      expect(authStore.refreshToken).toBeNull();
      expect(authStore.user).toBeNull();
      expect(localStorage.getItem('raji_access_token')).toBeNull();
      expect(localStorage.getItem('raji_refresh_token')).toBeNull();
      expect(localStorage.getItem('raji_user')).toBeNull();
    });

    it('deve limpar state mesmo se API de logout falhar', async () => {
      // Setup: simula estado logado
      authStore.setTokens('access-123', 'refresh-456');
      authStore.setUser(mockUser);

      vi.mocked(authService.logout).mockRejectedValue(new Error('Network error'));

      await authStore.logout();

      expect(authStore.accessToken).toBeNull();
      expect(authStore.refreshToken).toBeNull();
      expect(authStore.user).toBeNull();
    });
  });

  describe('refreshTokenAction()', () => {
    it('deve atualizar tokens no state e localStorage', async () => {
      authStore.setTokens('old-access', 'old-refresh');

      vi.mocked(authService.refreshToken).mockResolvedValue({
        success: true,
        data: {
          accessToken: 'new-access-999',
          refreshToken: 'new-refresh-888',
        },
      });

      await authStore.refreshTokenAction();

      expect(authStore.accessToken).toBe('new-access-999');
      expect(authStore.refreshToken).toBe('new-refresh-888');
      expect(localStorage.getItem('raji_access_token')).toBe('new-access-999');
      expect(localStorage.getItem('raji_refresh_token')).toBe('new-refresh-888');
    });

    it('deve lancar erro quando nao ha refresh token', async () => {
      await expect(authStore.refreshTokenAction()).rejects.toThrow('No refresh token available');
    });
  });

  describe('loadFromStorage()', () => {
    it('deve carregar tokens e user do localStorage para o state', () => {
      localStorage.setItem('raji_access_token', 'stored-access');
      localStorage.setItem('raji_refresh_token', 'stored-refresh');
      localStorage.setItem('raji_user', JSON.stringify(mockUser));

      authStore.loadFromStorage();

      expect(authStore.accessToken).toBe('stored-access');
      expect(authStore.refreshToken).toBe('stored-refresh');
      expect(authStore.user).toEqual(mockUser);
    });

    it('deve manter state vazio quando localStorage esta vazio', () => {
      authStore.loadFromStorage();

      expect(authStore.accessToken).toBeNull();
      expect(authStore.refreshToken).toBeNull();
      expect(authStore.user).toBeNull();
    });

    it('deve tratar JSON invalido no user graciosamente', () => {
      localStorage.setItem('raji_access_token', 'stored-access');
      localStorage.setItem('raji_user', 'invalid-json{{{');

      authStore.loadFromStorage();

      expect(authStore.accessToken).toBe('stored-access');
      expect(authStore.user).toBeNull();
    });
  });

  describe('isAuthenticated getter', () => {
    it('deve retornar true quando tem accessToken', () => {
      authStore.setTokens('some-token', 'some-refresh');

      expect(authStore.isAuthenticated).toBe(true);
    });

    it('deve retornar false quando accessToken e null', () => {
      expect(authStore.isAuthenticated).toBe(false);
    });
  });
});
