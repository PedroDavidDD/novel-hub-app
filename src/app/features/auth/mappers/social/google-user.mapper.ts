import { Injectable } from '@angular/core';
import { SocialUser } from '../../interfaces/social/social-auth.interface';
import { User, UserRole } from '../../../../core/models/user.model';
import { SocialUserMapper, SocialLoginPayload } from './social-user.mapper';

/**
 * Mapper específico para Google
 * Extiende el mapper base con lógica específica de Google si es necesario
 */
@Injectable({ providedIn: 'root' })
export class GoogleUserMapper extends SocialUserMapper {

  override mapToDomain(socialUser: SocialUser): User {
    const baseUser = super.mapToDomain(socialUser);

    // Lógica específica de Google (ej: verificar dominios de empresa)
    if (socialUser.email.endsWith('@company.com')) {
      return { ...baseUser, role: UserRole.USER_NOVELS };
    }

    return baseUser;
  }

  override mapToBackendPayload(socialUser: SocialUser): GoogleLoginPayload {
    const basePayload = super.mapToBackendPayload(socialUser);

    return {
      ...basePayload,
      // Google proporciona un ID Token JWT que puede enviarse al backend
      idToken: (socialUser.rawData as any)?.exp ? socialUser.rawData : undefined
    };
  }
}

interface GoogleLoginPayload extends SocialLoginPayload {
  idToken?: unknown;
}
