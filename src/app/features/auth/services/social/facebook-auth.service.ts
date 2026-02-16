import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../../../environments/environments';
import { FacebookAdapter } from '../../adapters/social/facebook.adapter';
import {
  SocialProvider,
  SocialAuthResponse,
  SocialUser
} from '../../interfaces/social/social-auth.interface';
import {
  FacebookAuthResponse,
  FacebookUserInfo,
  FacebookLoginStatus
} from '../../interfaces/social/facebook.interface';

/**
 * Servicio específico para Facebook OAuth 2.0
 * Maneja la integración con Facebook SDK
 */
@Injectable({ providedIn: 'root' })
export class FacebookAuthService implements SocialProvider {
  readonly name = 'facebook';
  readonly icon = 'facebook';
  readonly color = '#1877F2';

  private facebookAdapter = inject(FacebookAdapter);
  private scriptLoaded = signal(false);

  async login(): Promise<SocialAuthResponse> {
    await this.loadFacebookScript();

    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK not loaded'));
        return;
      }

      window.FB.login((loginResponse: FacebookLoginStatus) => {
        if (loginResponse.status !== 'connected') {
          resolve({
            success: false,
            provider: 'facebook',
            accessToken: '',
            user: {} as SocialUser,
            error: 'Facebook login failed or was cancelled'
          });
          return;
        }

        this.fetchUserInfo(loginResponse.authResponse!, resolve);
      }, {
        scope: environments.oauth.facebook.scopes.join(',')
      });
    });
  }

  private fetchUserInfo(
    authResponse: FacebookAuthResponse,
    resolve: (value: SocialAuthResponse) => void
  ): void {
    const fields = environments.oauth.facebook.fields.join(',');

    window.FB!.api(`/me?fields=${fields}`, 'GET', (userInfo: FacebookUserInfo | { error: any }) => {
      if (!userInfo || 'error' in userInfo) {
        resolve({
          success: false,
          provider: 'facebook',
          accessToken: '',
          user: {} as SocialUser,
          error: 'Failed to fetch user info from Facebook'
        });
        return;
      }

      this.facebookAdapter.setUserInfo(userInfo);

      if (!this.facebookAdapter.validate(authResponse)) {
        resolve({
          success: false,
          provider: 'facebook',
          accessToken: '',
          user: {} as SocialUser,
          error: 'Invalid Facebook auth response'
        });
        return;
      }

      const socialUser = this.facebookAdapter.adapt(authResponse);

      resolve({
        success: true,
        provider: 'facebook',
        accessToken: authResponse.accessToken,
        expiresIn: authResponse.expiresIn,
        user: socialUser
      });
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      if (window.FB) {
        window.FB.logout(() => resolve());
      } else {
        resolve();
      }
    });
  }

  isAuthenticated(): boolean {
    return false;
  }

  private loadFacebookScript(): Promise<void> {
    if (this.scriptLoaded()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // Inicializar Facebook SDK
      (window as any).fbAsyncInit = () => {
        window.FB!.init({
          appId: environments.oauth.facebook.appId,
          cookie: true,
          xfbml: true,
          version: environments.oauth.facebook.version
        });
        this.scriptLoaded.set(true);
        resolve();
      };

      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
