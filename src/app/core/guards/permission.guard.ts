import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission.service';

/**
 * Guard para verificar permisos específicos de acciones de página
 * 
 * Uso en rutas:
 * {
 *   path: 'novels/:id/delete',
 *   canActivate: [permissionGuard('novels.delete')],
 *   component: DeleteNovelComponent
 * }
 */
export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    if (permissionService.hasPermission(requiredPermission)) {
      return true;
    }

    // Redirigir a 404 si no tiene permiso
    return router.createUrlTree(['/404']);
  };
};
