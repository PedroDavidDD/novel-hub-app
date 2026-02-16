import { Injectable } from '@angular/core';
import { SocialUser } from '../../interfaces/social/social-auth.interface';
import { User, UserRole } from '../../../../core/models/user.model';

/**
 * Mapper para transformar SocialUser a User del dominio
 * Permite manejar cambios en la estructura de respuesta del backend
 */
@Injectable({ providedIn: 'root' })
export class SocialUserMapper {

  /**
   * Mapea SocialUser a User del dominio
   */
  mapToDomain(socialUser: SocialUser): User {
    return {
      id: socialUser.id,
      email: socialUser.email,
      name: socialUser.name,
      username: socialUser.email.split('@')[0], // Generar username del email
      isActive: true,
      roles: [UserRole.USER_HOME],
      role: UserRole.USER_HOME,
      avatar: socialUser.avatar
    };
  }

  /**
   * Preparar payload para enviar al backend
   */
  mapToBackendPayload(socialUser: SocialUser): SocialLoginPayload {
    return {
      provider: socialUser.provider,
      providerId: socialUser.providerId,
      email: socialUser.email,
      name: socialUser.name,
      firstName: socialUser.firstName,
      lastName: socialUser.lastName,
      avatar: socialUser.avatar,
      rawData: socialUser.rawData
    };
  }
}

export interface SocialLoginPayload {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  rawData?: unknown;
}
