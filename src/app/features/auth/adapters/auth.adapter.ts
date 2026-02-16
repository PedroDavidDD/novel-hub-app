import { User, UserRole } from '../../../core/models/user.model';
import { AuthData } from '../interfaces/auth.interface';

/**
 * Adaptador para transformar respuestas de autenticación
 * del backend al modelo de dominio de la aplicación
 */
export class AuthAdapter {
  /**
   * Adapta la respuesta de la API al modelo de dominio User
   */
  static toDomain(data: AuthData): User {
    const { user } = data;

    // El backend retorna role como string (ej: "ROLE_COMMON")
    // O como array en roles (opcional)
    const primaryRole = (user.role as UserRole) || UserRole.USER_COMMON;
    const roles = user.roles?.map(role => role as UserRole) || [primaryRole];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      isActive: user.isActive,
      roles: roles,
      role: primaryRole
    };
  }

  /**
   * @deprecated Usar toDomain con AuthData
   * Mantener por compatibilidad temporal
   */
  static adaptLegacy(data: any): any {
    const user = this.toDomain(data);
    return {
      ...user,
      token: data.token
    };
  }
}
