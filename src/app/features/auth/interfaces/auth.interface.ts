/**
 * Respuesta estándar de la API del backend
 * Toda respuesta sigue este formato
 */
export interface ApiResponse<T> {
  statusCode: 0 | 1; // 1 = éxito, 0 = error
  data: T;
  msg?: string;
}

/**
 * Estructura de datos de autenticación dentro de ApiResponse
 */
export interface AuthData {
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    isActive: boolean;
    role: string;        // Rol principal (ej: "ROLE_COMMON")
    roles?: string[];    // Array de roles (opcional, para compatibilidad)
    permissions?: string[];
  };
  token: string;
  refreshToken: string;
  tokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

/**
 * @deprecated Usar AuthData directamente
 * Mantener por compatibilidad temporal
 */
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

/**
 * @deprecated Usar AuthData directamente
 */
export type AuthResponse = AuthResponseDto;

/**
 * Credenciales para login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Datos para registro de usuario
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
}

/**
 * @deprecated Usar RegisterData
 */
export interface AuthRequestDto {
  grant_type: string;
  client_id: string;
  client_secret?: string;
  username?: string;
  password?: string;
  refresh_token?: string;
}
