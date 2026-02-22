import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserRole } from '../models/user.model';
import { SUPER_ROLES } from '../constants/auth.constants';

/**
 * Servicio para verificar permisos del usuario
 * Usa los permisos del backend (user.permissions)
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private authService = inject(AuthService);

  // Obtener permisos del usuario actual
  private get userPermissions(): string[] {
    const user = this.authService._user();
    return user?.permissions || [];
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param permission Permiso a verificar (ej: 'novels.read', 'novels.delete')
 * @returns true si tiene el permiso
   */
  hasPermission(permission: string): boolean {
    const user = this.authService._user();

    // Super roles tienen todos los permisos
    if (user && SUPER_ROLES.includes(user.role)) {
      return true;
    }

    // Verificar permiso específico
    return this.userPermissions.includes(permission);
  }

  /**
   * Verifica si el usuario tiene al menos uno de los permisos
   * @param permissions Array de permisos
   * @returns true si tiene al menos uno
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Verifica si el usuario tiene todos los permisos
   * @param permissions Array de permisos
   * @returns true si tiene todos
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }
}
