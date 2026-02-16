// DTO (Data Transfer Object) - Official API Structure
export interface AuthResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_info: {
    uid: string;
    mail: string;
    display_name: string;
    user_roles: string[];
  };
}

export type AuthResponse = AuthResponseDto;

export interface AuthRequestDto {
  grant_type: string;
  client_id: string;
  client_secret?: string;
  username?: string;
  password?: string;
  refresh_token?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
  confirmPassword?: string;
  fullName: string;
}
