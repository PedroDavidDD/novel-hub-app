import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserRole } from '../models/user.model';
import { SUPER_ROLES } from '../constants/auth.constants';

/**
 * Guard de autenticación y autorización
 * 
 * Roles:
 * - ROLE_GOD: Acceso total
 * - ROLE_BOSS: Acceso total
 * - ROLE_ADMIN: Acceso total
 * - ROLE_HOME: Acceso a /home
 * - ROLE_NOVELS: Acceso a /novels
 * - ROLE_COMMON: Acceso básico (solo /home)
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar directamente en sessionStorage como fallback
  const token = sessionStorage.getItem('access_token');
  const userData = sessionStorage.getItem('user_data');

  // Intentar obtener del estado del servicio primero
  let isAuth = authService.isAuthenticated();
  let user = authService._user();

  // Si el servicio no tiene el estado pero sessionStorage sí, usar sessionStorage
  if (!isAuth && token && userData) {
    try {
      user = JSON.parse(userData);
      isAuth = true;
    } catch {
      // Error parseando, continuar como no autenticado
    }
  }

  // 1. Verificación básica de autenticación
  if (!isAuth) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  // 2. Verificación de Roles (Autorización)
  const requiredRoles = route.data?.['roles'] as UserRole[];
  if (!requiredRoles || requiredRoles.length === 0) return true;

  // Roles con acceso total (God, Boss, Admin)
  if (user && SUPER_ROLES.includes(user.role)) {
    return true;
  }

  // ROLE_COMMON: Solo acceso a /home
  if (user?.role === UserRole.USER_COMMON) {
    const canAccess = requiredRoles.some(role => role === UserRole.USER_HOME);
    if (canAccess) return true;

    // Si intenta acceder a /novels u otras rutas protegidas
    return router.createUrlTree(['/404']);
  }

  // Verificar si tiene alguno de los roles requeridos específicos
  const hasRole = user && requiredRoles.includes(user.role);

  if (!hasRole) {
    return router.createUrlTree(['/404']);
  }

  return true;
};
