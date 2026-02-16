/**
 * GUÍA: Cómo agregar un nuevo proveedor OAuth 2.0 con angular-oauth2-oidc
 *
 * Este archivo contiene instrucciones paso a paso para integrar
 * un nuevo proveedor de autenticación social (ej: Twitter/X, GitHub, Discord)
 * usando la librería angular-oauth2-oidc
 *
 * PASOS:
 */

// ============================================================================
// PASO 1: Agregar configuración en environments.ts
// ============================================================================
// Archivo: src/environments/environments.ts
//
// Agregar dentro de oauth: {
/*
[proveedor]: {
  issuer: 'https://[dominio-del-proveedor]',
  clientId: 'TU_CLIENT_ID',
  redirectUri: window.location.origin + '/#/auth/callback',
  scope: 'scope1 scope2',
  responseType: 'token', // o 'code' para Authorization Code flow
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  oidc: false // true si soporta OpenID Connect
}
*/

// ============================================================================
// PASO 2: Agregar al tipo SocialProviderType
// ============================================================================
// Archivo: src/app/features/auth/interfaces/social/social-auth.interface.ts
//
// Modificar la línea:
// export type SocialProviderType = 'google' | 'facebook' | 'github';

// ============================================================================
// PASO 3: Agregar configuración en OAuthConfigService
// ============================================================================
// Archivo: src/app/features/auth/services/social/oauth-config.service.ts
//
/*
get[Proveedor]Config(): AuthConfig {
  return {
    issuer: environments.oauth.[proveedor].issuer,
    clientId: environments.oauth.[proveedor].clientId,
    redirectUri: environments.oauth.[proveedor].redirectUri,
    scope: environments.oauth.[proveedor].scope,
    responseType: environments.oauth.[proveedor].responseType,
    showDebugInformation: environments.oauth.[proveedor].showDebugInformation,
    strictDiscoveryDocumentValidation: environments.oauth.[proveedor].strictDiscoveryDocumentValidation,
    oidc: environments.oauth.[proveedor].oidc,
    skipIssuerCheck: true
  };
}
*/

// ============================================================================
// PASO 4: Crear el servicio del proveedor
// ============================================================================
// Archivo: src/app/features/auth/services/social/[proveedor]-auth.service.ts
//
// Ejemplo:
/*
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { OAuthConfigService } from './oauth-config.service';
import {
  SocialProvider,
  SocialAuthResponse,
  SocialUser
} from '../../interfaces/social/social-auth.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class [Proveedor]AuthService implements SocialProvider {
  readonly name = '[proveedor]';
  readonly icon = '[proveedor]';
  readonly color = '#[color-hex]';

  private oauthService = inject(OAuthService);
  private configService = inject(OAuthConfigService);
  private http = inject(HttpClient);
  private isInitialized = false;

  async login(): Promise<SocialAuthResponse> {
    try {
      this.oauthService.configure(this.configService.get[Proveedor]Config());

      if (!this.isInitialized) {
        await this.oauthService.loadDiscoveryDocumentAndTryLogin();
        this.isInitialized = true;
      }

      this.oauthService.initLoginFlow();

      return new Promise((resolve) => {
        const checkLogin = setInterval(() => {
          if (this.oauthService.hasValidAccessToken()) {
            clearInterval(checkLogin);
            // Obtener información del usuario
            this.fetchUserInfo().then(user => {
              resolve({
                success: true,
                provider: '[proveedor]',
                accessToken: this.oauthService.getAccessToken(),
                user: user
              });
            }).catch(error => {
              resolve({
                success: false,
                provider: '[proveedor]',
                accessToken: '',
                user: {} as SocialUser,
                error: error.message
              });
            });
          }
        }, 500);

        setTimeout(() => {
          clearInterval(checkLogin);
          resolve({
            success: false,
            provider: '[proveedor]',
            accessToken: '',
            user: {} as SocialUser,
            error: 'Login timeout'
          });
        }, 300000);
      });
    } catch (error) {
      return {
        success: false,
        provider: '[proveedor]',
        accessToken: '',
        user: {} as SocialUser,
        error: error instanceof Error ? error.message : '[Proveedor] login failed'
      };
    }
  }

  async logout(): Promise<void> {
    this.oauthService.logOut();
  }

  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  async handleAuthCallback(): Promise<SocialAuthResponse> {
    try {
      this.oauthService.configure(this.configService.get[Proveedor]Config());
      await this.oauthService.loadDiscoveryDocument();

      const result = await this.oauthService.tryLogin();

      if (result) {
        const user = await this.fetchUserInfo();
        return {
          success: true,
          provider: '[proveedor]',
          accessToken: this.oauthService.getAccessToken(),
          user: user
        };
      }

      return {
        success: false,
        provider: '[proveedor]',
        accessToken: '',
        user: {} as SocialUser,
        error: 'Authentication failed'
      };
    } catch (error) {
      return {
        success: false,
        provider: '[proveedor]',
        accessToken: '',
        user: {} as SocialUser,
        error: error instanceof Error ? error.message : 'Callback failed'
      };
    }
  }

  private async fetchUserInfo(): Promise<SocialUser> {
    // Implementar según la API del proveedor
    const accessToken = this.oauthService.getAccessToken();
    // ...
  }
}
*/

// ============================================================================
// PASO 5: Registrar el servicio en SocialAuthService
// ============================================================================
// Archivo: src/app/features/auth/services/social/social-auth.service.ts
//
// 1. Importar el servicio:
// import { [Proveedor]AuthService } from './[proveedor]-auth.service';
//
// 2. Inyectar:
// private [proveedor]Auth = inject([Proveedor]AuthService);
//
// 3. Agregar al mapa:
/*
private readonly providers = new Map<SocialProviderType, SocialProvider>([
  ['google', this.googleAuth],
  ['facebook', this.facebookAuth],
  ['[proveedor]', this.[proveedor]Auth]
]);
*/

// ============================================================================
// PASO 6: Crear el componente de botón (opcional)
// ============================================================================
// Archivo: src/app/features/auth/components/social/[proveedor]-login-button.component.ts
//
// Similar a los botones existentes de Google y Facebook

// ============================================================================
// PASO 7: Crear página de callback (si es necesario)
// ============================================================================
// Para manejar la redirección después del login OAuth
//
// Archivo: src/app/features/auth/pages/oauth-callback/oauth-callback.component.ts
//
/*
import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthFacade } from '../../../../core/services/auth.facade';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  template: '<div class="flex justify-center items-center h-screen">Processing login...</div>'
})
export class OAuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authFacade = inject(AuthFacade);

  ngOnInit(): void {
    const provider = this.route.snapshot.queryParamMap.get('provider') as SocialProviderType;
    if (provider) {
      this.authFacade.handleOAuthCallback(provider).subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: () => this.router.navigateByUrl('/auth/login')
      });
    }
  }
}
*/

// ============================================================================
// NOTAS IMPORTANTES:
// ============================================================================
//
// 1. OIDC vs OAuth2:
//    - OIDC (OpenID Connect): Proveedores como Google, Auth0, Okta
//      Proporcionan ID Tokens JWT con información del usuario
//    - OAuth2 puro: Facebook, GitHub, Discord
//      Requieren llamadas adicionales a la API para obtener datos del usuario
//
// 2. Discovery Document:
//    - Algunos proveedores (Google, Auth0) soportan discovery document
//      que permite cargar configuración automáticamente
//    - Otros (Facebook) requieren configuración manual de endpoints
//
// 3. PKCE:
//    - angular-oauth2-oidc soporta PKCE automáticamente para Authorization Code flow
//    - Altamente recomendado para aplicaciones SPA
//
// 4. Tokens:
//    - Access Token: Para llamadas a la API del proveedor
//    - ID Token (OIDC): JWT con información del usuario
//    - Refresh Token: Para obtener nuevos access tokens (si el proveedor lo soporta)
