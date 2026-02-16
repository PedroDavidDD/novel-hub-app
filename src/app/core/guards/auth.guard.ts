import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Guard de autenticación y autorización
 * 
 * Roles:
 * - ROLE_ADMIN: Acceso total
 * - ROLE_HOME: Acceso a /home
 * - ROLE_NOVELS: Acceso a /novels
 * - ROLE_COMMON: Rol básico, acceso a /home y /novels
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Verificar directamente en sessionStorage como fallback
  const token = sessionStorage.getItem('access_token');
  const userData = sessionStorage.getItem('user_data');
  
  // Intentar obtener del estado del servicio primero
  let isAuth = authService.isAuthenticated();
  let user = authService.user();
  
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

  // Si es admin, permitir todo
  if (user?.role === UserRole.ADMIN) return true;

  // Si tiene ROLE_COMMON, tiene acceso básico a home y novels
  if (user?.role === UserRole.USER_COMMON) {
    const canAccess = requiredRoles.some(role => 
      role === UserRole.USER_HOME || role === UserRole.USER_NOVELS
    );
    if (canAccess) return true;
  }

  // Verificar si tiene alguno de los roles requeridos
  const hasRole = user && requiredRoles.includes(user.role);

  if (!hasRole) {
    return router.createUrlTree(['/404']);
  }

  return true;
};
