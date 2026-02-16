import { inject } from '@angular/core';
import { Router, type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

/**
 * Guard que previene que usuarios autenticados accedan a rutas públicas
 * como login o register usando CanMatchFn con async/await.
 * 
 * Si el usuario está autenticado, redirige a /home
 * Si no está autenticado, permite el acceso
 */
export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar el estado de autenticación
  const authStatus = authService.authStatus();

  // Si está en modo checking, esperar un momento
  if (authStatus === 'checking') {
    // Esperar a que se resuelva el estado
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

  // No está autenticado, permitir acceso
  return true;
};
