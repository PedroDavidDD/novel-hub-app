export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  token?: string;
}

export interface AuthResponse {
  uuid: string;
  email: string;
  full_name: string;
  roles: string[];
  access_token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
