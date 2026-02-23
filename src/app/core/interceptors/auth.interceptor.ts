import { HttpErrorResponse, type HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, Observable, of, take, shareReplay } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';
import { Result } from '../../core/models/result.model';
import { User } from '../../core/models/user.model';

// Variable global para evitar múltiples refresh simultáneos
let activeRefreshRequest: Observable<Result<User>> | null = null;
// Variable para controlar si ya se mostró el toast de sesión expirada
let hasShownSessionExpired = false;
// Timeout para resetear las variables después de redirigir
let resetTimeout: any = null;

/**
 * Resetea las variables de control del refresh
 */
function resetRefreshControl(): void {
  if (resetTimeout) {
    clearTimeout(resetTimeout);
    resetTimeout = null;
  }
  activeRefreshRequest = null;
  hasShownSessionExpired = false;
}

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
  const isLogoutEndpoint = req.url.includes('/auth/logout');

  // Si es endpoint público, no agregar token
  if (isPublicEndpoint) {
    return next(req);
  }

  const token = authService.token();

  // Si no hay token, continuar sin auth
  if (!token) {
    return next(req);
  }

  // Verificar si token está expirado, omitir para logout para evitar refresh
  if (!isLogoutEndpoint && authService.isTokenExpired()) {
    // Intentar refrescar antes de continuar
    return handleTokenRefresh(req, next, authService, toastService, router);
  }

  // Agregar token y continuar
  const authReq = addTokenToRequest(req, token);
  return handleRequest(authReq, next, authService, toastService, router, isLogoutEndpoint);
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
  router: Router,
  isLogoutEndpoint: boolean
): Observable<any> {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isLogoutEndpoint) {
        // Token inválido o expirado, intentar refresh
        return handleTokenRefresh(req, next, authService, toastService, router);
      }

      if (error.status === 403 && !isLogoutEndpoint) {
        toastService.showError('No tienes permisos para realizar esta acción');
      } else if (error.status === 500 && !isLogoutEndpoint) {
        toastService.showError('Error interno del servidor');
      }

      return throwError(() => error);
    })
  );
}

/**
 * Maneja el refresh del token
 * Usa shareReplay para compartir el resultado entre todas las peticiones concurrentes
 */
function handleTokenRefresh(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  toastService: ToastService,
  router: Router
): Observable<any> {
  // Si ya hay un refresh en progreso, reusar el mismo Observable
  if (!activeRefreshRequest) {
    activeRefreshRequest = authService.refreshToken().pipe(
      shareReplay(1)
    );
  }

  return activeRefreshRequest.pipe(
    switchMap((result: Result<User>) => {
      if (result.success) {
        // Refrescar exitoso, reintentar petición original
        const newToken = authService.token();
        const authReq = addTokenToRequest(req, newToken!);
        return next(authReq);
      } else {
        // Refresh falló, logout y redirigir (solo se muestra una vez)
        if (!hasShownSessionExpired) {
          hasShownSessionExpired = true;
          
          // Cancelar timeout anterior si existe
          if (resetTimeout) {
            clearTimeout(resetTimeout);
          }
          
          // Programar reset después de 5 segundos
          resetTimeout = setTimeout(() => {
            resetRefreshControl();
          }, 5000);
          
          authService.logout().pipe(take(1)).subscribe();
          toastService.showError('Sesión expirada. Por favor inicia sesión nuevamente.');
          router.navigate(['/auth/login']);
        }
        return throwError(() => new Error('Session expired'));
      }
    }),
    catchError(() => {
      // Error en refresh, logout y redirigir (solo se muestra una vez)
      if (!hasShownSessionExpired) {
        hasShownSessionExpired = true;
        
        // Cancelar timeout anterior si existe
        if (resetTimeout) {
          clearTimeout(resetTimeout);
        }
        
        // Programar reset después de 5 segundos
        resetTimeout = setTimeout(() => {
          resetRefreshControl();
        }, 5000);
        
        authService.logout().pipe(take(1)).subscribe();
        toastService.showError('Error de autenticación. Por favor inicia sesión nuevamente.');
        router.navigate(['/auth/login']);
      }
      return throwError(() => new Error('Auth error'));
    })
  );
}
