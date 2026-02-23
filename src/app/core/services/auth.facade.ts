import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { AuthState, User } from '../models/user.model';
import { Result } from '../models/result.model';
import { LoginCredentials, RegisterData } from '../../features/auth/interfaces/auth.interface';
import { SocialProviderType } from '../../features/auth/interfaces/social/social-auth.interface';

/**
 * @deprecated Usar AuthService directamente
 * AuthFacade ahora es un proxy hacia AuthService para mantener compatibilidad
 * Todos los métodos delegan a AuthService
 */
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private authService = inject(AuthService);

  // Delegar propiedades computadas
  get user() { return this.authService.user; }
  get _user() { return this.authService._user; }
  get isAuthenticated() { return this.authService.isAuthenticated; }
  get authStatus() { return this.authService.authStatus; }
  get isSocialLoading() { return this.authService.isSocialLoading; }
  get socialError() { return this.authService.socialError; }

  /**
   * Login con credenciales
   */
  login(credentials: LoginCredentials): Observable<Result<User>> {
    return this.authService.login(credentials);
  }

  /**
   * Registro de usuario
   */
  register(data: RegisterData): Observable<Result<User>> {
    return this.authService.register(data);
  }

  /**
   * Login con proveedor social
   */
  loginWithSocial(provider: SocialProviderType): Observable<Result<User>> {
    return this.authService.loginWithSocial(provider);
  }

  /**
   * Logout
   */
  logout(): void {
    this.authService.logout().pipe(take(1)).subscribe();
  }

  /**
   * Refrescar token
   */
  refreshToken(): Observable<Result<User>> {
    return this.authService.refreshToken();
  }

  /**
   * Verificar si token está expirado
   */
  isTokenExpired(): boolean {
    return this.authService.isTokenExpired();
  }

  /**
   * Verificar token con backend
   */
  checkToken(): Observable<Result<User>> {
    return this.authService.checkToken();
  }
}
