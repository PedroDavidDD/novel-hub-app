import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { OAuthConfigService } from './oauth-config.service';
import {
  SocialProvider,
  SocialAuthResponse,
  SocialUser
} from '../../interfaces/social/social-auth.interface';

/**
 * Servicio de autenticación con Google usando angular-oauth2-oidc
 * Implementa OpenID Connect (OIDC)
 */
@Injectable({ providedIn: 'root' })
export class GoogleAuthService implements SocialProvider {
  readonly name = 'google';
  readonly icon = 'google';
  readonly color = '#4285F4';

  private oauthService = inject(OAuthService);
  private configService = inject(OAuthConfigService);
  private isInitialized = false;

  async login(): Promise<SocialAuthResponse> {
    try {

      // Configurar OAuth para Google
      this.oauthService.configure(this.configService.getGoogleConfig());

      this.oauthService.setupAutomaticSilentRefresh();

      // Cargar documento de descubrimiento
      if (!this.isInitialized) {
        await this.oauthService.loadDiscoveryDocument();
        // await this.oauthService.loadDiscoveryDocumentAndTryLogin();
        this.isInitialized = true;
      }
    
      // Iniciar flujo de login implicit
      this.oauthService.initLoginFlow();

      // Esperar a que el usuario complete el login
      return new Promise((resolve) => {
        const checkLogin = setInterval(() => {
          if (this.oauthService.hasValidAccessToken()) {
            clearInterval(checkLogin);
            const claims = this.oauthService.getIdentityClaims();
            const user = this.mapClaimsToUser(claims);

            resolve({
              success: true,
              provider: 'google',
              accessToken: this.oauthService.getAccessToken(),
              idToken: this.oauthService.getIdToken(),
              user: user
            });
          }
        }, 500);

        // Timeout después de 5 minutos
        setTimeout(() => {
          clearInterval(checkLogin);
          resolve({
            success: false,
            provider: 'google',
            accessToken: '',
            user: {} as SocialUser,
            error: 'Login timeout'
          });
        }, 300000);
      });
    } catch (error) {
      return {
        success: false,
        provider: 'google',
        accessToken: '',
        user: {} as SocialUser,
        error: error instanceof Error ? error.message : 'Google login failed'
      };
    }
  }

  async logout(): Promise<void> {
    this.oauthService.logOut();
  }

  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  /**
   * Maneja el callback después de la redirección de OAuth
   */
  async handleAuthCallback(): Promise<SocialAuthResponse> {
    try {
      this.oauthService.configure(this.configService.getGoogleConfig());
      await this.oauthService.loadDiscoveryDocument();

      const result = await this.oauthService.tryLogin();

      if (result) {
        const claims = this.oauthService.getIdentityClaims();
        const user = this.mapClaimsToUser(claims);

        return {
          success: true,
          provider: 'google',
          accessToken: this.oauthService.getAccessToken(),
          idToken: this.oauthService.getIdToken(),
          user: user
        };
      }

      return {
        success: false,
        provider: 'google',
        accessToken: '',
        user: {} as SocialUser,
        error: 'Authentication failed'
      };
    } catch (error) {
      return {
        success: false,
        provider: 'google',
        accessToken: '',
        user: {} as SocialUser,
        error: error instanceof Error ? error.message : 'Callback failed'
      };
    }
  }

  private mapClaimsToUser(claims: Record<string, any>): SocialUser {
    return {
      id: claims['sub'],
      email: claims['email'],
      name: claims['name'],
      firstName: claims['given_name'],
      lastName: claims['family_name'],
      avatar: claims['picture'],
      provider: 'google',
      providerId: claims['sub'],
      rawData: claims
    };
  }
}
