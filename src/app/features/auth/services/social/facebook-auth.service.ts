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

/**
 * Servicio de autenticación con Facebook usando angular-oauth2-oidc
 * Implementa OAuth2 puro (Facebook no soporta OIDC completamente)
 */
@Injectable({ providedIn: 'root' })
export class FacebookAuthService implements SocialProvider {
  readonly name = 'facebook';
  readonly icon = 'facebook';
  readonly color = '#1877F2';

  private oauthService = inject(OAuthService);
  private configService = inject(OAuthConfigService);
  private http = inject(HttpClient);
  private isInitialized = false;

  async login(): Promise<SocialAuthResponse> {
    try {
      // Configurar OAuth para Facebook
      this.oauthService.configure(this.configService.getFacebookConfig());

      if (!this.isInitialized) {
        this.isInitialized = true;
      }

      // Iniciar flujo de login
      this.oauthService.initLoginFlow();

      // Esperar a que el usuario complete el login
      return new Promise((resolve) => {
        const checkLogin = setInterval(() => {
          if (this.oauthService.hasValidAccessToken()) {
            clearInterval(checkLogin);
            this.fetchUserInfo().then(user => {
              resolve({
                success: true,
                provider: 'facebook',
                accessToken: this.oauthService.getAccessToken(),
                user: user
              });
            }).catch(error => {
              resolve({
                success: false,
                provider: 'facebook',
                accessToken: '',
                user: {} as SocialUser,
                error: error.message
              });
            });
          }
        }, 500);

        // Timeout después de 5 minutos
        setTimeout(() => {
          clearInterval(checkLogin);
          resolve({
            success: false,
            provider: 'facebook',
            accessToken: '',
            user: {} as SocialUser,
            error: 'Login timeout'
          });
        }, 300000);
      });
    } catch (error) {
      return {
        success: false,
        provider: 'facebook',
        accessToken: '',
        user: {} as SocialUser,
        error: error instanceof Error ? error.message : 'Facebook login failed'
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
      this.oauthService.configure(this.configService.getFacebookConfig());

      const result = await this.oauthService.tryLogin();

      if (result) {
        const user = await this.fetchUserInfo();

        return {
          success: true,
          provider: 'facebook',
          accessToken: this.oauthService.getAccessToken(),
          user: user
        };
      }

      return {
        success: false,
        provider: 'facebook',
        accessToken: '',
        user: {} as SocialUser,
        error: 'Authentication failed'
      };
    } catch (error) {
      return {
        success: false,
        provider: 'facebook',
        accessToken: '',
        user: {} as SocialUser,
        error: error instanceof Error ? error.message : 'Callback failed'
      };
    }
  }

  /**
   * Obtiene información del usuario desde la API de Facebook
   */
  private async fetchUserInfo(): Promise<SocialUser> {
    const accessToken = this.oauthService.getAccessToken();
    const fields = 'id,email,name,first_name,last_name,picture';

    try {
      const response = await firstValueFrom(
        this.http.get<any>(`https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`)
      );

      return {
        id: response.id,
        email: response.email,
        name: response.name,
        firstName: response.first_name,
        lastName: response.last_name,
        avatar: response.picture?.data?.url,
        provider: 'facebook',
        providerId: response.id,
        rawData: response
      };
    } catch (error) {
      throw new Error('Failed to fetch Facebook user info');
    }
  }
}
