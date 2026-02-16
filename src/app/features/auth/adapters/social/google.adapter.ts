import { Injectable } from '@angular/core';
import { BaseSocialAdapter } from './base-social.adapter';
import { SocialUser } from '../../interfaces/social/social-auth.interface';
import { GoogleCredentialResponse, GoogleTokenPayload } from '../../interfaces/social/google.interface';

/**
 * Adaptador para Google OAuth 2.0
 * Transforma GoogleCredentialResponse → SocialUser
 */
@Injectable({ providedIn: 'root' })
export class GoogleAdapter extends BaseSocialAdapter<GoogleCredentialResponse> {

  adapt(response: GoogleCredentialResponse): SocialUser {
    const payload = this.decodeJwt(response.credential);

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      firstName: payload.given_name,
      lastName: payload.family_name,
      avatar: payload.picture,
      provider: 'google',
      providerId: payload.sub,
      rawData: payload
    };
  }

  validate(response: GoogleCredentialResponse): boolean {
    return !!response?.credential &&
      typeof response.credential === 'string' &&
      response.credential.split('.').length === 3;
  }

  isEmailVerified(response: GoogleCredentialResponse): boolean {
    const payload = this.decodeJwt(response.credential);
    return payload.email_verified === true;
  }

  private decodeJwt(token: string): GoogleTokenPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token from Google');
    }
  }
}
