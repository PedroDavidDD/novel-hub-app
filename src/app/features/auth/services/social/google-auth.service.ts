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
      sessionStorage.setItem('oauth_callback_url', window.location.href);
      sessionStorage.setItem('oauth_provider', 'google');

      this.oauthService.configure(this.configService.getGoogleConfig());
      this.oauthService.setupAutomaticSilentRefresh();

      if (!this.isInitialized) {
        await this.oauthService.loadDiscoveryDocument();
        this.isInitialized = true;
      }

      this.oauthService.initLoginFlow();

      // Mantiene la promesa pendiente mientras el navegador navega a Google
      return new Promise<SocialAuthResponse>(() => {});
    } catch (error) {
      return {
        success: false,
        provider: 'google',
        accessToken: '',
        idToken: '',
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

      let user: SocialUser | null = null;
      let idToken = '';
      let accessToken = '';

      const result = await this.oauthService.tryLogin({ disableNonceCheck: true });

      if (result) {
        const claims = this.oauthService.getIdentityClaims();
        if (claims && Object.keys(claims).length > 0) {
          user = this.mapClaimsToUser(claims);
          idToken = this.oauthService.getIdToken();
          accessToken = this.oauthService.getAccessToken();
        }
      }

      // Si tryLogin no resolvió las claims de OIDC, extraemos directamente el id_token del hash
      if (!user) {
        const fallback = this.extractClaimsFromHash();
        if (fallback) {
          user = fallback.user;
          idToken = fallback.idToken;
        }
      }

      if (user) {
        sessionStorage.removeItem('oauth_callback_url');
        sessionStorage.removeItem('oauth_provider');

        return {
          success: true,
          provider: 'google',
          accessToken,
          idToken,
          user
        };
      }

      return {
        success: false,
        provider: 'google',
        accessToken: '',
        idToken: '',
        user: {} as SocialUser,
        error: 'Authentication failed'
      };
    } catch (error) {
      // Intento de rescate mediante extracción directa del hash ante excepciones
      const fallback = this.extractClaimsFromHash();
      if (fallback) {
        sessionStorage.removeItem('oauth_callback_url');
        sessionStorage.removeItem('oauth_provider');

        return {
          success: true,
          provider: 'google',
          accessToken: '',
          idToken: fallback.idToken,
          user: fallback.user
        };
      }

      sessionStorage.removeItem('oauth_callback_url');
      sessionStorage.removeItem('oauth_provider');

      return {
        success: false,
        provider: 'google',
        accessToken: '',
        idToken: '',
        user: {} as SocialUser,
        error: error instanceof Error ? error.message : 'Callback failed'
      };
    }
  }

  /**
   * Extrae y decodifica las credenciales de Google id_token desde el hash de la URL
   */
  private extractClaimsFromHash(): { idToken: string; user: SocialUser } | null {
    try {
      const pendingHash = sessionStorage.getItem('pending_oauth_hash');
      const hash = (window.location.hash && window.location.hash.includes('id_token='))
        ? window.location.hash
        : (pendingHash || '');

      if (!hash || !hash.includes('id_token=')) {
        return null;
      }

      const hashContent = hash.startsWith('#') ? hash.substring(1) : hash;
      const params = new URLSearchParams(hashContent);
      const idToken = params.get('id_token');

      if (!idToken) {
        return null;
      }

      const parts = idToken.split('.');
      if (parts.length < 2) {
        return null;
      }

      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const claims = JSON.parse(payloadJson);

      return {
        idToken,
        user: this.mapClaimsToUser(claims)
      };
    } catch (err) {
      console.warn('Fallback hash parsing error:', err);
      return null;
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
