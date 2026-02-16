import { HttpErrorResponse, type HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable, of } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

/**
 * Interceptor de autenticación que:
 * 1. Agrega Bearer Token a las peticiones
 * 2. Verifica expiración antes de enviar
 * 3. Auto-refresca token cuando expira
 * 4. Maneja errores 401/403
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  // Lista de endpoints que no requieren auth
  const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  // Si es endpoint público, no agregar token
  if (isPublicEndpoint) {
    return next(req);
  }

  const token = authService.token();

  // Si no hay token, continuar sin auth
  if (!token) {
    return next(req);
  }

  // Verificar si token está expirado
  if (authService.isTokenExpired()) {
    // Intentar refrescar antes de continuar
    return handleTokenRefresh(req, next, authService, toastService, router);
  }

  // Agregar token y continuar
  const authReq = addTokenToRequest(req, token);
  return handleRequest(authReq, next, authService, toastService, router);
};

/**
 * Agrega token a la petición
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Maneja la petición con manejo de errores
 */
function handleRequest(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  toastService: ToastService,
  router: Router
): Observable<any> {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token inválido o expirado, intentar refresh
        return handleTokenRefresh(req, next, authService, toastService, router);
      }

      if (error.status === 403) {
        toastService.showError('No tienes permisos para realizar esta acción');
      } else if (error.status === 500) {
        toastService.showError('Error interno del servidor');
      }

      return throwError(() => error);
    })
  );
}

/**
 * Maneja el refresh del token
 */
function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  toastService: ToastService,
  router: Router
): Observable<any> {
  return authService.refreshToken().pipe(
    switchMap(result => {
      if (result.success) {
        // Refrescar exitoso, reintentar petición original
        const newToken = authService.token();
        const authReq = addTokenToRequest(req, newToken!);
        return next(authReq);
      } else {
        // Refresh falló, logout y redirigir
        authService.logout().subscribe();
        toastService.showError('Sesión expirada. Por favor inicia sesión nuevamente.');
        router.navigate(['/auth/login']);
        return throwError(() => new Error('Session expired'));
      }
    }),
    catchError(() => {
      // Error en refresh, logout
      authService.logout().subscribe();
      toastService.showError('Error de autenticación. Por favor inicia sesión nuevamente.');
      router.navigate(['/auth/login']);
      return throwError(() => new Error('Auth error'));
    })
  );
}
