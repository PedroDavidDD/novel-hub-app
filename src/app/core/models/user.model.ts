export enum UserRole {
  GOD = 'ROLE_GOD',
  BOSS = 'ROLE_BOSS',
  ADMIN = 'ROLE_ADMIN',
  USER_HOME = 'ROLE_HOME',
  USER_NOVELS = 'ROLE_NOVELS',
  USER_COMMON = 'ROLE_COMMON'
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  isActive: boolean;
  roles: UserRole[];
  role: UserRole;
  avatar?: string;
  permissions?: string[]; // Permisos del backend (ej: ['novels.read', 'home.read'])
}

export type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null;
  authStatus: AuthStatus;
}
