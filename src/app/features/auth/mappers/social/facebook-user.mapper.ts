import { Injectable } from '@angular/core';
import { SocialUser } from '../../interfaces/social/social-auth.interface';
import { User, UserRole } from '../../../../core/models/user.model';
import { SocialUserMapper, SocialLoginPayload } from './social-user.mapper';

/**
 * Mapper específico para Facebook
 * Extiende el mapper base con lógica específica de Facebook si es necesario
 */
@Injectable({ providedIn: 'root' })
export class FacebookUserMapper extends SocialUserMapper {

  override mapToDomain(socialUser: SocialUser): User {
    const baseUser = super.mapToDomain(socialUser);

    // Lógica específica de Facebook (ej: diferenciar usuarios por tipo de cuenta)
    return baseUser;
  }

  override mapToBackendPayload(socialUser: SocialUser): FacebookLoginPayload {
    const basePayload = super.mapToBackendPayload(socialUser);

    return {
      ...basePayload,
      // Facebook proporciona un access token que debe validarse en el backend
      accessToken: (socialUser.rawData as any)?.authResponse?.accessToken
    };
  }
}

interface FacebookLoginPayload extends SocialLoginPayload {
  accessToken?: string;
}
