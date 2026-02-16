export enum UserRole {
  USER_HOME = 'ROLE_HOME',     // Solo accede a /home
  USER_NOVELS = 'ROLE_NOVELS', // Solo accede a /novels
  ADMIN = 'ROLE_ADMIN'         // Accede a todo
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
