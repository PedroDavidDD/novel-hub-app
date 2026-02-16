/**
 * Contrato base para cualquier proveedor OAuth 2.0
 * Permite agregar nuevos proveedores sin modificar código existente
 */
export interface SocialProvider {
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  login(): Promise<SocialAuthResponse>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
}

/**
 * Respuesta estandarizada de cualquier proveedor OAuth
 * Independiente del proveedor específico
 */
export interface SocialAuthResponse {
  success: boolean;
  provider: SocialProviderType;
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user: SocialUser;
  error?: string;
}

/**
 * Usuario estandarizado de cualquier proveedor OAuth
 */
export interface SocialUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: SocialProviderType;
  providerId: string;
  rawData?: unknown;
}

export type SocialProviderType = 'google' | 'facebook';

/**
 * Configuración para inicializar un proveedor
 */
export interface SocialProviderConfig {
  clientId: string;
  redirectUri?: string;
  scopes?: string[];
  [key: string]: unknown;
}
