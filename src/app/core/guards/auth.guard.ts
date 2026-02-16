import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthFacade } from '../services/auth.facade';
import { UserRole } from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  const user = authFacade.user();

  // 1. Verificación básica de autenticación
  if (!authFacade.isAuthenticated()) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  // 2. Verificación de Roles (Autorización)
  const requiredRoles = route.data?.['roles'] as UserRole[];
  if (!requiredRoles || requiredRoles.length === 0) return true;

  const hasRole = user && (user.role === UserRole.ADMIN || requiredRoles.includes(user.role));

  if (!hasRole) {
    return router.createUrlTree(['/404']); // O una página de "No Autorizado"
  }

  return true;
};