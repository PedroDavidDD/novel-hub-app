import { inject } from '@angular/core';
import { Router, type CanActivateFn, type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

/**
 * Guard que previene que usuarios autenticados accedan a rutas públicas
 * como login o register.
 * 
 * Si el usuario está autenticado, redirige a /home
 * Si no está autenticado, permite el acceso
 */
export const notAuthenticatedGuard: CanActivateFn = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar el estado de autenticación
  const authStatus = authService.authStatus();

  // Si está en modo checking, esperar un momento
  if (authStatus === 'checking') {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Obtener el usuario actual
  const user = authService._user();
  const isAuth = authService.isAuthenticated();

  // Si está autenticado, redirigir a home
  if (isAuth && user) {
    await router.navigateByUrl('/home');
    return false;
  }

  // No está autenticado, permitir acceso a login/register
  return true;
};

export const NotAuthenticatedGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): Promise<boolean> => {
  return notAuthenticatedGuard(undefined as any, undefined as any) as Promise<boolean>;
};
