import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission.service';

export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return async (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    if (await permissionService.hasPermission(requiredPermission)) {
      return true;
    }

    return router.createUrlTree(['/404']);
  };
};
