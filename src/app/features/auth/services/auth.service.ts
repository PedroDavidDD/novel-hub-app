import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of, throwError, catchError, map, tap, BehaviorSubject } from 'rxjs';
import { environments } from '../../../../environments/environments';
import { AuthAdapter } from '../adapters/auth.adapter';
import { 
  ApiResponse, 
  AuthData, 
  LoginCredentials, 
  RegisterData 
} from '../interfaces/auth.interface';
import { AuthState, User } from '../../../core/models/user.model';
import { Result } from '../../../core/models/result.model';
import { SocialAuthService } from './social/social-auth.service';
import { SocialProviderType, SocialAuthResponse } from '../interfaces/social/social-auth.interface';
import { SocialUserMapper } from '../mappers/social/social-user.mapper';
import { Router } from '@angular/router';

/**
 * Servicio de autenticación unificado
 * Maneja login, registro, logout, refresh token y autenticación social
 * Usa sessionStorage para persistencia
 * Implementa auto-refresh de tokens
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = environments.baseUrl;
  private readonly socialAuth = inject(SocialAuthService);
  private readonly socialUserMapper = inject(SocialUserMapper);

  // Estado reactivo con Signals
  private readonly _state = signal<AuthState>(this.loadStateFromStorage());

  // Getters computados para el estado
  readonly _user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly token = computed(() => this._state().token);
  readonly authStatus = computed(() => this._state().authStatus);
  
  // Alias para compatibilidad
  readonly user = this._user;

  // Estado específico para login social
  readonly isSocialLoading = signal<boolean>(false);
  readonly socialError = signal<string | null>(null);

  // Subject para manejar refresh token
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    // Inicializar auto-refresh al cargar
    // this.initializeAutoRefresh();
  }

  /**
   * Login con credenciales de usuario
   */
  login(credentials: LoginCredentials): Observable<Result<User>> {
    return this.http.post<ApiResponse<AuthData>>(
      `${this.baseUrl}/auth/login`, 
      credentials
    ).pipe(
      map(response => {
        if (response.statusCode === 1) {
          this.saveSession(response.data);
          return Result.ok(AuthAdapter.toDomain(response.data));
        }
        return Result.fail<User>(response.msg || 'Login failed');
      }),
      catchError(error => {
        const msg = error.error?.msg || 'Invalid credentials';
        return of(Result.fail<User>(msg));
      })
    );
  }

  /**
   * Registro de nuevo usuario
   */
  register(data: RegisterData): Observable<Result<User>> {
    return this.http.post<ApiResponse<AuthData>>(
      `${this.baseUrl}/auth/register`, 
      data
    ).pipe(
      map(response => {
        if (response.statusCode === 1) {
          this.saveSession(response.data);
          return Result.ok(AuthAdapter.toDomain(response.data));
        }
        return Result.fail<User>(response.msg || 'Registration failed');
      }),
      catchError(error => {
        const msg = error.error?.msg || 'Registration error';
        return of(Result.fail<User>(msg));
      })
    );
  }

  /**
   * Logout - Invalida token en backend y limpia sesión
   */
  logout(): Observable<Result<void>> {
    const token = this._state().token;
    
    if (!token) {
      this.clearSession();
      return of(Result.ok<void>(undefined));
    }

    return this.http.post<ApiResponse<null>>(
      `${this.baseUrl}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      tap(() => this.clearSession()),
      map(() => Result.ok<void>(undefined)),
      catchError(error => {
        // Aunque falle el backend, limpiamos sesión local
        this.clearSession();
        return of(Result.ok<void>(undefined));
      })
    );
  }

  /**
   * Login con proveedor OAuth (Google, Facebook)
   */
  loginWithSocial(provider: SocialProviderType): Observable<Result<User>> {
    this.isSocialLoading.set(true);
    this.socialError.set(null);

    return this.socialAuth.login(provider).pipe(
      switchMap((socialResult: Result<SocialAuthResponse>): Observable<Result<User>> => {
        if (!socialResult.success) {
          this.isSocialLoading.set(false);
          this.socialError.set(socialResult.error || 'Social login failed');
          return of(Result.fail<User>(socialResult.error || 'Social login failed'));
        }

        const payload = this.socialUserMapper.mapToBackendPayload(
          socialResult.data!.user
        );

        return this.http.post<ApiResponse<AuthData>>(
          `${this.baseUrl}/auth/social/login`,
          payload
        ).pipe(
          map((response: ApiResponse<AuthData>): Result<User> => {
            if (response.statusCode === 1) {
              this.saveSession(response.data);
              return Result.ok(AuthAdapter.toDomain(response.data));
            }
            return Result.fail<User>(response.msg || 'Social login failed');
          }),
          catchError((error): Observable<Result<User>> => {
            const errorMsg = error.error?.msg || 'Failed to complete social login';
            this.socialError.set(errorMsg);
            return of(Result.fail<User>(errorMsg));
          })
        );
      }),
      tap(() => this.isSocialLoading.set(false))
    );
  }

  /**
   * Refrescar token usando refresh token
   */
  refreshToken(): Observable<Result<User>> {
    const refreshToken = this._state().refreshToken;
    
    if (!refreshToken) {
      return of(Result.fail<User>('No refresh token available'));
    }

    if (this.isRefreshing) {
      // Si ya estamos refrescando, esperamos a que termine
      return this.refreshTokenSubject.pipe(
        switchMap(token => {
          if (token) {
            return of(Result.ok(this._state().user!));
          }
          return of(Result.fail<User>('Refresh failed'));
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.http.post<ApiResponse<AuthData>>(
      `${this.baseUrl}/auth/refresh`,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` }
      }
    ).pipe(
      map(response => {
        this.isRefreshing = false;
        if (response.statusCode === 1) {
          this.saveSession(response.data);
          this.refreshTokenSubject.next(response.data.token);
          return Result.ok(AuthAdapter.toDomain(response.data));
        }
        this.refreshTokenSubject.next(null);
        return Result.fail<User>(response.msg || 'Refresh failed');
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        this.clearSession();
        return of(Result.fail<User>('Session expired'));
      })
    );
  }

  /**
   * Verificar si el token está expirado
   */
  isTokenExpired(): boolean {
    const expiresAt = this._state().tokenExpiresAt;
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  }

  /**
   * Obtener tiempo restante antes de expirar (en ms)
   */
  getTokenTimeRemaining(): number {
    const expiresAt = this._state().tokenExpiresAt;
    if (!expiresAt) return 0;
    return expiresAt - Date.now();
  }

  /**
   * Verificar token con el backend
   */
  checkToken(): Observable<Result<User>> {
    const token = this._state().token;
    if (!token) {
      return of(Result.fail<User>('No token'));
    }

    return this.http.get<ApiResponse<AuthData>>(
      `${this.baseUrl}/auth/check-token`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      map(response => {
        if (response.statusCode === 1) {
          return Result.ok(AuthAdapter.toDomain(response.data));
        }
        return Result.fail<User>(response.msg || 'Invalid token');
      }),
      catchError(() => {
        return of(Result.fail<User>('Token check failed'));
      })
    );
  }

  /**
   * Guardar sesión en sessionStorage y estado
   */
  private saveSession(data: AuthData): void {
    const user = AuthAdapter.toDomain(data);
    const expiresAt = Date.now() + (data.tokenExpiresIn * 1000);

    const newState: AuthState = {
      user,
      isAuthenticated: true,
      authStatus: 'authenticated',
      token: data.token,
      refreshToken: data.refreshToken,
      tokenExpiresAt: expiresAt
    };

    this._state.set(newState);
    
    // Guardar en sessionStorage
    sessionStorage.setItem('access_token', data.token);
    sessionStorage.setItem('refresh_token', data.refreshToken);
    sessionStorage.setItem('user_data', JSON.stringify(user));
    sessionStorage.setItem('token_expires_at', expiresAt.toString());
  }

  /**
   * Limpiar sesión
   */
  private clearSession(): void {
    this._state.set({
      user: null,
      isAuthenticated: false,
      authStatus: 'not-authenticated',
      token: null,
      refreshToken: null,
      tokenExpiresAt: null
    });

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user_data');
    sessionStorage.removeItem('token_expires_at');
  }

  /**
   * Cargar estado desde sessionStorage
   */
  private loadStateFromStorage(): AuthState {
    const token = sessionStorage.getItem('access_token');
    const refreshToken = sessionStorage.getItem('refresh_token');
    const userData = sessionStorage.getItem('user_data');
    const expiresAt = sessionStorage.getItem('token_expires_at');

    if (token && userData) {
      try {
        const user = JSON.parse(userData) as User;
        return {
          user,
          isAuthenticated: true,
          authStatus: 'authenticated',
          token,
          refreshToken,
          tokenExpiresAt: expiresAt ? parseInt(expiresAt, 10) : null
        };
      } catch {
        // Datos corruptos, limpiar
        this.clearSession();
      }
    }

    return {
      user: null,
      isAuthenticated: false,
      authStatus: 'not-authenticated',
      token: null,
      refreshToken: null,
      tokenExpiresAt: null
    };
  }

  /**
   * Inicializar auto-refresh de token
   */
  private initializeAutoRefresh(): void {
    // Verificar cada minuto si el token está por expirar
    setInterval(() => {
      if (this.isAuthenticated() && this.isTokenExpired()) {
        // Token expirado, intentar refresh
        this.refreshToken().subscribe();
      } else if (this.isAuthenticated()) {
        // Token válido, verificar si falta menos de 5 minutos para expirar
        const timeRemaining = this.getTokenTimeRemaining();
        if (timeRemaining > 0 && timeRemaining < 5 * 60 * 1000) {
          // Refrescar preventivamente
          this.refreshToken().subscribe();
        }
      }
    }, 60000); // Cada 60 segundos
  }
}
