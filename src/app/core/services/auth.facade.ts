import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of, finalize, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState, User } from '../models/user.model';
import { Result } from '../models/result.model';
import { AuthRequestDto, AuthResponseDto, LoginCredentials } from '../../features/auth/interfaces/auth.interface';
import { AuthAdapter } from '../../features/auth/adapters/auth.adapter';
import { environments } from '../../../environments/environments';
import { SocialAuthService } from '../../features/auth/services/social/social-auth.service';
import { SocialProviderType, SocialAuthResponse } from '../../features/auth/interfaces/social/social-auth.interface';
import { SocialUserMapper } from '../../features/auth/mappers/social/social-user.mapper';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environments.baseUrl;
  private readonly socialAuth = inject(SocialAuthService);
  private readonly socialUserMapper = inject(SocialUserMapper);

  private readonly state = signal<AuthState>({
    user: this.getUserFromStorage(),
    isAuthenticated: !!sessionStorage.getItem('access_token'),
    token: sessionStorage.getItem('access_token')
  });

  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);

  // Estado específico para login social
  readonly isSocialLoading = signal<boolean>(false);
  readonly socialError = signal<string | null>(null);

  /**
   * Login using UI Credentials
   * Maps 'email' to 'username' for OAuth2 compliance
   */
  login(credentials: LoginCredentials): Observable<Result<User>> {
    const payload: AuthRequestDto = {
      grant_type: 'password',
      client_id: 'novel-hub-client',
      username: credentials.email,
      password: credentials.password
    };

    return this.http.post<AuthResponseDto>(`${this.baseUrl}/auth/login`, payload).pipe(
      map(response => {
        this.saveSession(response);
        const user = AuthAdapter.toDomain(response);
        this.state.update(s => ({ ...s, user, isAuthenticated: true, token: response.access_token }));
        return Result.ok(user);
      }),
      catchError(() => of(Result.fail<User>('Credenciales inválidas', 'AUTH_001')))
    );
  }

  /**
   * Login con proveedor OAuth 2.0 (Google, Facebook, etc.)
   * Facilita la integración de nuevos proveedores
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

        // Transformar a payload del backend
        const payload = this.socialUserMapper.mapToBackendPayload(
          socialResult.data!.user
        );

        // Enviar al backend para validación y generación de token propio
        return this.http.post<AuthResponseDto>(
          `${this.baseUrl}/auth/social/login`,
          payload
        ).pipe(
          map((response: AuthResponseDto): Result<User> => {
            this.saveSession(response);
            const user = AuthAdapter.toDomain(response);
            this.state.update(s => ({
              ...s,
              user,
              isAuthenticated: true,
              token: response.access_token
            }));
            return Result.ok(user);
          }),
          catchError((error): Observable<Result<User>> => {
            const errorMsg = error.error?.message || 'Failed to complete social login';
            this.socialError.set(errorMsg);
            return of(Result.fail<User>(errorMsg));
          })
        );
      }),
      finalize(() => this.isSocialLoading.set(false))
    );
  }

  logout(): void {
    sessionStorage.clear();
    this.state.set({ user: null, isAuthenticated: false, token: null });
  }

  private saveSession(response: AuthResponseDto): void {
    sessionStorage.setItem('access_token', response.access_token);
    sessionStorage.setItem('refresh_token', response.refresh_token);
    sessionStorage.setItem('user_data', JSON.stringify(AuthAdapter.toDomain(response)));
  }

  private getUserFromStorage(): User | null {
    const data = sessionStorage.getItem('user_data');
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
}
