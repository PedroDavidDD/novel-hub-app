import { Injectable } from '@angular/core';
import { BaseSocialAdapter } from './base-social.adapter';
import { SocialUser } from '../../interfaces/social/social-auth.interface';
import { FacebookAuthResponse, FacebookUserInfo } from '../../interfaces/social/facebook.interface';

/**
 * Adaptador para Facebook OAuth 2.0
 * Transforma FacebookAuthResponse + FacebookUserInfo → SocialUser
 */
@Injectable({ providedIn: 'root' })
export class FacebookAdapter extends BaseSocialAdapter<FacebookAuthResponse> {
  private userInfo: FacebookUserInfo | null = null;

  setUserInfo(userInfo: FacebookUserInfo): void {
    this.userInfo = userInfo;
  }

  adapt(response: FacebookAuthResponse): SocialUser {
    if (!this.userInfo) {
      throw new Error('Facebook user info not set. Call setUserInfo() before adapt().');
    }

    return {
      id: this.userInfo.id,
      email: this.userInfo.email,
      name: this.userInfo.name,
      firstName: this.userInfo.first_name,
      lastName: this.userInfo.last_name,
      avatar: this.userInfo.picture?.data?.url,
      provider: 'facebook',
      providerId: this.userInfo.id,
      rawData: {
        authResponse: response,
        userInfo: this.userInfo
      }
    };
  }

  validate(response: FacebookAuthResponse): boolean {
    return !!response?.accessToken &&
      !!response?.userID &&
      typeof response.accessToken === 'string';
  }

  isEmailVerified(): boolean {
    // Facebook considera el email verificado si el usuario lo proporciona
    return !!this.userInfo?.email;
  }
}
