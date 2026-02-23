import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { PermissionService } from '../services/permission.service';
import { ToastService } from '../../shared/services/toast.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const token = sessionStorage.getItem('access_token');
  const userData = sessionStorage.getItem('user_data');

  let isAuth = authService.isAuthenticated();
  let user = authService._user();

  if (!isAuth && token && userData) {
    try {
      user = JSON.parse(userData);
      isAuth = true;
    } catch {}
  }

  if (!isAuth) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  const requiredPermissions = route.data?.['permissions'] as string[] | undefined;

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  const hasAnyPermission = await permissionService.hasAnyPermission(requiredPermissions);

  if (!hasAnyPermission) {
    const routePath = state.url.split('/')[1] || state.url;
    toastService.showError(
      `No tienes los permisos necesarios para acceder a ${routePath}. Contacta al administrador.`,
      5000,
      'Acceso Denegado'
    );

    return router.createUrlTree(['/auth/login'], {
      queryParams: {
        returnUrl: state.url,
        reason: 'insufficient_permissions'
      }
    });
  }

  return true;
};
