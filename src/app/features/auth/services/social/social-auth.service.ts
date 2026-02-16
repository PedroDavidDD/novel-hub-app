import { Injectable, inject } from '@angular/core';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Result } from '../../../../core/models/result.model';
import {
  SocialProvider,
  SocialAuthResponse,
  SocialProviderType
} from '../../interfaces/social/social-auth.interface';
import { GoogleAuthService } from './google-auth.service';
import { FacebookAuthService } from './facebook-auth.service';

/**
 * Servicio fachada para autenticación social
 * Actúa como punto único de entrada para cualquier proveedor OAuth
 *
 * PARA AGREGAR UN NUEVO PROVEEDOR (ej: Twitter/X, GitHub):
 * 1. Crear el servicio del proveedor (ej: x-auth.service.ts)
 * 2. Implementar la interfaz SocialProvider
 * 3. Registrar el servicio en el constructor de esta clase
 * 4. Agregar al mapa de providers
 */
@Injectable({ providedIn: 'root' })
export class SocialAuthService {
  private googleAuth = inject(GoogleAuthService);
  private facebookAuth = inject(FacebookAuthService);

  // Mapa de proveedores disponibles
  // Agregar nuevos proveedores aquí
  private readonly providers = new Map<SocialProviderType, SocialProvider>([
    ['google', this.googleAuth],
    ['facebook', this.facebookAuth]
  ]);

  /**
   * Login con cualquier proveedor soportado
   */
  login(provider: SocialProviderType): Observable<Result<SocialAuthResponse>> {
    const service = this.providers.get(provider);

    if (!service) {
      return throwError(() => new Error(`Provider ${provider} not configured`));
    }

    return from(service.login()).pipe(
      map((response: SocialAuthResponse): Result<SocialAuthResponse> => {
        if (response.success) {
          return Result.ok<SocialAuthResponse>(response);
        }
        return Result.fail<SocialAuthResponse>(response.error || 'Authentication failed');
      }),
      catchError((error): Observable<Result<SocialAuthResponse>> => {
        return of(Result.fail<SocialAuthResponse>(
          error.message || 'An error occurred during authentication'
        ));
      })
    );
  }

  /**
   * Logout de un proveedor específico
   */
  logout(provider: SocialProviderType): Observable<Result<void>> {
    const service = this.providers.get(provider);

    if (!service) {
      return throwError(() => new Error(`Provider ${provider} not configured`));
    }

    return from(service.logout()).pipe(
      map((): Result<void> => Result.ok<void>(undefined)),
      catchError((error): Observable<Result<void>> => {
        return of(Result.fail<void>(error.message || 'Logout failed'));
      })
    );
  }

  /**
   * Verifica si un proveedor está configurado
   */
  isProviderAvailable(provider: SocialProviderType): boolean {
    return this.providers.has(provider);
  }

  /**
   * Obtiene lista de proveedores disponibles
   */
  getAvailableProviders(): SocialProviderType[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Obtiene la configuración de un proveedor (para UI)
   */
  getProviderConfig(provider: SocialProviderType): { name: string; icon: string; color: string } | null {
    const service = this.providers.get(provider);
    if (!service) return null;

    return {
      name: service.name,
      icon: service.icon,
      color: service.color
    };
  }
}
