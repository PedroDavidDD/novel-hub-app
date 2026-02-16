/**
 * GUÍA: Cómo agregar un nuevo proveedor OAuth 2.0
 *
 * Este archivo contiene instrucciones paso a paso para integrar
 * un nuevo proveedor de autenticación social (ej: Twitter/X, GitHub, Discord)
 *
 * PASOS:
 */

// ============================================================================
// PASO 1: Crear las interfaces del proveedor
// ============================================================================
// Archivo: src/app/features/auth/interfaces/social/[proveedor].interface.ts
//
// Ejemplo para Twitter/X:
/*
export interface XAuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  scope: string;
}

export interface XUserInfo {
  id: string;
  username: string;
  name: string;
  email?: string;
  profile_image_url?: string;
}

// Declaración global para el SDK
declare global {
  interface Window {
    X?: {
      // Métodos del SDK
    };
  }
}
*/

// ============================================================================
// PASO 2: Agregar al tipo SocialProviderType
// ============================================================================
// Archivo: src/app/features/auth/interfaces/social/social-auth.interface.ts
//
// Modificar la línea:
// export type SocialProviderType = 'google' | 'facebook' | 'x';

// ============================================================================
// PASO 3: Crear el adaptador del proveedor
// ============================================================================
// Archivo: src/app/features/auth/adapters/social/[proveedor].adapter.ts
//
// Ejemplo:
/*
import { Injectable } from '@angular/core';
import { BaseSocialAdapter } from './base-social.adapter';
import { SocialUser } from '../../interfaces/social/social-auth.interface';
import { XAuthResponse, XUserInfo } from '../../interfaces/social/x.interface';

@Injectable({ providedIn: 'root' })
export class XAdapter extends BaseSocialAdapter<XAuthResponse> {
  private userInfo: XUserInfo | null = null;

  setUserInfo(userInfo: XUserInfo): void {
    this.userInfo = userInfo;
  }

  adapt(response: XAuthResponse): SocialUser {
    if (!this.userInfo) {
      throw new Error('X user info not set');
    }

    return {
      id: this.userInfo.id,
      email: this.userInfo.email || '', // X no siempre proporciona email
      name: this.userInfo.name,
      provider: 'x',
      providerId: this.userInfo.id,
      avatar: this.userInfo.profile_image_url,
      rawData: {
        authResponse: response,
        userInfo: this.userInfo
      }
    };
  }

  validate(response: XAuthResponse): boolean {
    return !!response?.accessToken && !!response?.tokenType;
  }

  isEmailVerified(): boolean {
    // X requiere verificación de email por separado
    return false;
  }
}
*/

// ============================================================================
// PASO 4: Crear el mapper del proveedor (opcional)
// ============================================================================
// Archivo: src/app/features/auth/mappers/social/[proveedor]-user.mapper.ts
//
// Ejemplo:
/*
import { Injectable } from '@angular/core';
import { SocialUser } from '../../interfaces/social/social-auth.interface';
import { User } from '../../../../core/models/user.model';
import { SocialUserMapper, SocialLoginPayload } from './social-user.mapper';

@Injectable({ providedIn: 'root' })
export class XUserMapper extends SocialUserMapper {
  override mapToDomain(socialUser: SocialUser): User {
    const baseUser = super.mapToDomain(socialUser);
    return baseUser;
  }

  override mapToBackendPayload(socialUser: SocialUser): XLoginPayload {
    const basePayload = super.mapToBackendPayload(socialUser);
    return {
      ...basePayload,
      accessToken: (socialUser.rawData as any)?.authResponse?.accessToken,
      username: (socialUser.rawData as any)?.userInfo?.username
    };
  }
}

interface XLoginPayload extends SocialLoginPayload {
  accessToken?: string;
  username?: string;
}
*/

// ============================================================================
// PASO 5: Crear el servicio del proveedor
// ============================================================================
// Archivo: src/app/features/auth/services/social/[proveedor]-auth.service.ts
//
// Ejemplo:
/*
import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../../../environments/environments';
import { XAdapter } from '../../adapters/social/x.adapter';
import {
  SocialProvider,
  SocialAuthResponse,
  SocialUser
} from '../../interfaces/social/social-auth.interface';
import { XAuthResponse, XUserInfo } from '../../interfaces/social/x.interface';

@Injectable({ providedIn: 'root' })
export class XAuthService implements SocialProvider {
  readonly name = 'x';
  readonly icon = 'x';
  readonly color = '#000000';

  private xAdapter = inject(XAdapter);
  private scriptLoaded = signal(false);

  async login(): Promise<SocialAuthResponse> {
    // Implementar lógica de login con X OAuth 2.0
    // Generalmente requiere:
    // 1. Redirección a authorization URL
    // 2. Manejo de callback con código
    // 3. Intercambio de código por access token
    // 4. Obtención de información del usuario
  }

  async logout(): Promise<void> {
    // Implementar logout
  }

  isAuthenticated(): boolean {
    return false;
  }
}
*/

// ============================================================================
// PASO 6: Agregar configuración al environment
// ============================================================================
// Archivo: src/environments/environments.ts
//
// Agregar dentro de oauth: {
/*
x: {
  clientId: 'TU_X_CLIENT_ID',
  clientSecret: 'TU_X_CLIENT_SECRET', // Solo para backend
  redirectUri: 'http://localhost:4200/#/auth/callback/x',
  scopes: ['tweet.read', 'users.read'],
  authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token'
}
*/

// ============================================================================
// PASO 7: Registrar el servicio en SocialAuthService
// ============================================================================
// Archivo: src/app/features/auth/services/social/social-auth.service.ts
//
// 1. Importar el servicio:
// import { XAuthService } from './x-auth.service';
//
// 2. Inyectar en el constructor:
// private xAuth = inject(XAuthService);
//
// 3. Agregar al mapa de providers:
/*
private readonly providers = new Map<SocialProviderType, SocialProvider>([
  ['google', this.googleAuth],
  ['facebook', this.facebookAuth],
  ['x', this.xAuth]  // <-- NUEVO PROVEEDOR
]);
*/

// ============================================================================
// PASO 8: Crear el componente de botón (opcional)
// ============================================================================
// Archivo: src/app/features/auth/components/social/[proveedor]-login-button.component.ts
//
// Ejemplo:
/*
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginButtonComponent } from './social-login-button.component';

@Component({
  selector: 'app-x-login-button',
  standalone: true,
  imports: [CommonModule, SocialLoginButtonComponent],
  template: `
    <app-social-login-button
      provider="x"
      providerLabel="X"
      [color]="'#000000'"
      [isLoading]="isLoading()"
      [isDisabled]="isDisabled()"
      (clicked)="clicked.emit($event)"
    >
      <!-- SVG del logo de X -->
    </app-social-login-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XLoginButtonComponent {
  isLoading = input<boolean>(false);
  isDisabled = input<boolean>(false);
  clicked = output<void>();
}
*/

// ============================================================================
// PASO 9: Usar en la página de login
// ============================================================================
// Archivo: src/app/features/auth/pages/login-page/login-page.component.html
//
// Agregar junto a los otros botones:
// <app-x-login-button
//   [isLoading]="isSocialLoading()"
//   (clicked)="onSocialLogin('x')"
// />

// ============================================================================
// NOTAS IMPORTANTES:
// ============================================================================
//
// 1. BACKEND: Asegúrate de que tu backend tenga un endpoint /auth/social/login
//    que pueda validar los tokens de acceso de cada proveedor.
//
// 2. OAUTH 2.0: Diferentes proveedores pueden tener flujos ligeramente diferentes:
//    - Google: Usa popup con Google Identity Services
//    - Facebook: Usa SDK de Facebook con FB.login()
//    - X/Twitter: Requiere redirect flow (más complejo)
//    - GitHub: Requiere redirect flow
//
// 3. EMAIL: No todos los proveedores proporcionan email:
//    - Google y Facebook: Siempre proporcionan email
//    - X/Twitter: Email es opcional y requiere permisos adicionales
//
// 4. SCOPES: Revisa la documentación de cada proveedor para saber qué
//    scopes necesitas solicitar.
