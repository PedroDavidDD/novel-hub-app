import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { AuthState, User } from '../models/user.model';
import { Result } from '../models/result.model';
import { AuthRequestDto, AuthResponseDto, LoginCredentials } from '../../features/auth/interfaces/auth.interface';
import { AuthAdapter } from '../../features/auth/adapters/auth.adapter';
import { environments } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environments.baseUrl;
  
  private readonly state = signal<AuthState>({
    user: this.getUserFromStorage(),
    isAuthenticated: !!sessionStorage.getItem('access_token'),
    token: sessionStorage.getItem('access_token')
  });

  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => this.state().isAuthenticated);

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
