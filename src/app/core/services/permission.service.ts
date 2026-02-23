import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';
import { RolesService, Role } from './roles.service';
import { UserRole } from '../models/user.model';
import { SUPER_ROLES } from '../constants/auth.constants';

interface CachedPermissions {
  roleName: UserRole;
  permissions: string[];
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private authService = inject(AuthService);
  private rolesService = inject(RolesService);

  private permissionsCache = new Map<string, CachedPermissions>();
  private readonly CACHE_DURATION = 60 * 60 * 1000;

  private async getAllPermissions(): Promise<string[]> {
    const user = this.authService._user();

    if (!user) return [];

    if (user.permissions && user.permissions.length > 0) {
      return user.permissions;
    }

    return await this.getRolePermissions(user.role);
  }

  private async getRolePermissions(roleName: UserRole): Promise<string[]> {
    const cacheKey = roleName;

    const cached = this.permissionsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.permissions;
    }

    const response = await this.rolesService.getRoleByName(roleName).toPromise();

    if (response && response.statusCode === 1 && response.data && response.data.length > 0) {
      const roleData = response.data[0];
      const permissions = roleData.permissions || [];

      this.permissionsCache.set(cacheKey, {
        roleName,
        permissions,
        timestamp: Date.now()
      });

      return permissions;
    }

    return [];
  }

  async hasPermission(permission: string): Promise<boolean> {
    const user = this.authService._user();

    if (!user) return false;

    if (SUPER_ROLES.includes(user.role)) {
      return true;
    }

    const permissions = await this.getAllPermissions();

    if (permissions.includes('*')) {
      return true;
    }

    return permissions.includes(permission);
  }

  async hasAnyPermission(permissions: string[]): Promise<boolean> {
    for (const permission of permissions) {
      if (await this.hasPermission(permission)) {
        return true;
      }
    }
    return false;
  }

  async hasAllPermissions(permissions: string[]): Promise<boolean> {
    for (const permission of permissions) {
      if (!(await this.hasPermission(permission))) {
        return false;
      }
    }
    return true;
  }
}
