export enum UserRole {
  GOD = 'ROLE_GOD',
  BOSS = 'ROLE_BOSS',
  ADMIN = 'ROLE_ADMIN',
  USER_COMMON = 'ROLE_COMMON',
}

export interface UserStorageData {
  email: string;
  name: string;
  roleDisplayName?: string;
  username: string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  username: string;
  isActive?: boolean;
  role: UserRole;
  idRole?: string;
  roleDisplayName?: string;
  avatar?: string;
  about?: string;
  createdAt?: string | Date;
  permissions?: string[];
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
