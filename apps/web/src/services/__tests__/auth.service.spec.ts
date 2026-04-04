import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the api module before importing auth service
vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
  },
}));

import api from '../api';
import authService from '../auth.service';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login()', () => {
    it('deve chamar POST /auth/login com email e password', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            accessToken: 'access-123',
            refreshToken: 'refresh-456',
            user: { id: '1', email: 'test@raji.com', name: 'Test' },
          },
        },
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@raji.com',
        password: 'password123',
      });

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@raji.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('register()', () => {
    it('deve chamar POST /auth/register com dados completos', async () => {
      const registerData = {
        name: 'Test User',
        email: 'test@raji.com',
        password: 'password123',
        familyName: 'Familia Test',
      };
      const mockResponse = {
        data: {
          success: true,
          data: {
            accessToken: 'access-789',
            refreshToken: 'refresh-012',
            user: { id: '1', email: 'test@raji.com', name: 'Test User' },
          },
        },
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.register(registerData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('refreshToken()', () => {
    it('deve chamar POST /auth/refresh com o token', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
          },
        },
      };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await authService.refreshToken('old-refresh-token');

      expect(api.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout()', () => {
    it('deve chamar POST /auth/logout', async () => {
      vi.mocked(api.post).mockResolvedValue({});

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });
  });
});
