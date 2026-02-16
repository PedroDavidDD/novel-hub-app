import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../../../environments/environments';
import { GoogleAdapter } from '../../adapters/social/google.adapter';
import {
  SocialProvider,
  SocialAuthResponse,
  SocialUser
} from '../../interfaces/social/social-auth.interface';
import { GoogleCredentialResponse } from '../../interfaces/social/google.interface';

/**
 * Servicio específico para Google OAuth 2.0
 * Maneja la integración con Google Identity Services
 */
@Injectable({ providedIn: 'root' })
export class GoogleAuthService implements SocialProvider {
  readonly name = 'google';
  readonly icon = 'google';
  readonly color = '#4285F4';

  private googleAdapter = inject(GoogleAdapter);
  private scriptLoaded = signal(false);

  async login(): Promise<SocialAuthResponse> {
    await this.loadGoogleScript();

    return new Promise((resolve) => {
      window.google!.accounts.id.initialize({
        client_id: environments.oauth.google.clientId,
        callback: (response: GoogleCredentialResponse) => {
          this.handleCredentialResponse(response, resolve);
        },
        ux_mode: environments.oauth.google.uxMode,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      window.google!.accounts.id.prompt((notification: any) => {
        if (notification.isSkippedMoment && notification.isSkippedMoment()) {
          resolve({
            success: false,
            provider: 'google',
            accessToken: '',
            user: {} as SocialUser,
            error: 'Login cancelled by user'
          });
        }
      });
    });
  }

  private handleCredentialResponse(
    response: GoogleCredentialResponse,
    resolve: (value: SocialAuthResponse) => void
  ): void {
    if (!this.googleAdapter.validate(response)) {
      resolve({
        success: false,
        provider: 'google',
        accessToken: '',
        user: {} as SocialUser,
        error: 'Invalid credentials received'
      });
      return;
    }

    const socialUser = this.googleAdapter.adapt(response);

    resolve({
      success: true,
      provider: 'google',
      accessToken: response.credential,
      idToken: response.credential,
      user: socialUser
    });
  }

  async logout(): Promise<void> {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  isAuthenticated(): boolean {
    return false;
  }

  private loadGoogleScript(): Promise<void> {
    if (this.scriptLoaded()) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded.set(true);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}
