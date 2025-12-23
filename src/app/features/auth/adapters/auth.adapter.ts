import { AuthResponse, User } from "../interfaces/auth.interface";

export class AuthAdapter {
  static adapt(response: AuthResponse): User {
    return {
      id: response.uuid,
      email: response.email,
      fullName: response.full_name,
      role: response.roles.includes('admin') ? 'admin' : 'user',
      token: response.access_token
    };
  }
}
