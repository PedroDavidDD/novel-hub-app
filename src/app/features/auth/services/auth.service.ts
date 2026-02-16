import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, delay, tap } from 'rxjs/operators';
import { LoginCredentials, RegisterData, AuthResponse } from '../interfaces/auth.interface';
import { User } from '../../../core/models/user.model';
import { AuthAdapter } from '../adapters/auth.adapter';
import { environments } from '../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environments.baseUrl;
  private _currentUser: User | null = null;
  private readonly MOCK_STORAGE_KEY = 'mock_users';

  get currentUser(): User | null {
    return this._currentUser;
  }

  // --- Mock Helpers ---
  private getMockUsers(): any[] {
    const stored = sessionStorage.getItem(this.MOCK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveMockUser(user: any): void {
    const users = this.getMockUsers();
    users.push(user);
    sessionStorage.setItem(this.MOCK_STORAGE_KEY, JSON.stringify(users));
  }

  private findMockUser(email: string): any | undefined {
    // Check hardcoded admin first
    if (email === 'admin@google.com') { // Example admin
      return {
        uuid: 'admin-uuid-123',
        email: 'admin@google.com',
        full_name: 'Admin User',
        roles: ['admin'],
        access_token: 'mock-admin-token'
      };
    }
    // Check session storage
    return this.getMockUsers().find(u => u.email === email);
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        map(response => AuthAdapter.adapt(response)),
        catchError(error => {
          console.warn('API Error, attempting mock login:', error);

          // Check mock data
          const mockUserRaw = this.findMockUser(credentials.email);

          if (mockUserRaw) {
            // Simulate checking password (in a real app, hash check)
            // Here we blindly accept if user exists for the mock flow, or strict pass check if saved
            // For simplicity, we assume password is correct if user exists in this mock fallback

            const user = AuthAdapter.adapt({
              ...mockUserRaw,
              access_token: mockUserRaw.access_token || 'mock-jwt-token'
            });
            return of(user).pipe(delay(800)); // Simulate network
          }

          return throwError(() => new Error('Invalid credentials (Mock)'));
        }),
        tap((data: any) => {
          this._currentUser = data as User;
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        })
      );
  }

  register(data: RegisterData): Observable<User> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data)
      .pipe(
        map(response => AuthAdapter.adapt(response)),
        catchError(error => {
          console.warn('API Error, registering to mock storage:', error);

          // Check if already exists in mock
          if (this.findMockUser(data.email)) {
            return throwError(() => new Error('User already exists (Mock)'));
          }

          const newMockUser: AuthResponse = {
            access_token: 'mock-jwt-token-register-' + Date.now(),
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            user_info: {
              uid: crypto.randomUUID(),
              mail: data.email,
              display_name: data.fullName,
              user_roles: ['user']
            }
          };

          this.saveMockUser(newMockUser);

          return of(AuthAdapter.adapt(newMockUser)).pipe(delay(800));
        }),
        tap((data: any) => {
          this._currentUser = data as User;
          if (data.token) {
            localStorage.setItem('token', data.token);
          }
        })
      );
  }

  logout(): void {
    this._currentUser = null;
    localStorage.removeItem('token');
  }
}
