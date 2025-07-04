import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  lastLogin?: string;
  avatar?: string;
  organization?: string;
  department?: string;
  accessLevel: 'BOARD' | 'C_LEVEL' | 'SENIOR_VP' | 'DEPARTMENT_HEAD' | 'MANAGER';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await authApi.post<AuthResponse>('/login', credentials);
      const { user, token, refreshToken } = response.data;

      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_refresh_token', refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(user));

      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async logout(): Promise<void> {
    try {
      await authApi.post('/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('auth_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authApi.post<{ token: string }>('/refresh', {
        refreshToken,
      });
      
      const { token } = response.data;
      localStorage.setItem('auth_token', token);
      return token;
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');

    if (!userStr || !token) {
      return null;
    }

    try {
      // Verify token is still valid
      const response = await authApi.get<User>('/me');
      const user = response.data;
      
      // Update stored user data
      localStorage.setItem('auth_user', JSON.stringify(user));
      return user;
    } catch (error) {
      // Token is invalid, clear storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
      return null;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await authApi.post('/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Password change failed');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await authApi.post('/forgot-password', { email });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Password reset request failed');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    return !!(token && user);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  hasPermission(permission: string): boolean {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return false;

    try {
      const user: User = JSON.parse(userStr);
      return user.permissions.includes(permission);
    } catch {
      return false;
    }
  }

  hasRole(role: string): boolean {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return false;

    try {
      const user: User = JSON.parse(userStr);
      return user.role === role;
    } catch {
      return false;
    }
  }

  hasAccessLevel(level: User['accessLevel']): boolean {
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return false;

    try {
      const user: User = JSON.parse(userStr);
      const levels: User['accessLevel'][] = ['BOARD', 'C_LEVEL', 'SENIOR_VP', 'DEPARTMENT_HEAD', 'MANAGER'];
      const userLevelIndex = levels.indexOf(user.accessLevel);
      const requiredLevelIndex = levels.indexOf(level);
      
      return userLevelIndex <= requiredLevelIndex;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();