import { User, UserRole } from '../../../core/models/user.model';
import { AuthResponseDto } from '../interfaces/auth.interface';

export class AuthAdapter {
  /**
   * Adapts the API DTO to the Domain User Model.
   * Strictly follows the AuthResponseDto structure.
   */
  static toDomain(dto: AuthResponseDto): User {
    const { user_info } = dto;

    return {
      id: user_info?.uid,
      email: user_info?.mail,
      name: user_info?.display_name,
      role: (user_info?.user_roles[0] as UserRole) || UserRole.USER_HOME
    };
  }

  /**
   * Legacy adapter for backward compatibility.
   * Maps domain user back to a flat structure if needed by old services.
   */
  static adapt(dto: AuthResponseDto): any {
    const user = this.toDomain(dto);
    return {
      ...user,
      token: dto.access_token
    };
  }
}
