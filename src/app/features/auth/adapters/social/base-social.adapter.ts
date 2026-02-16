import { SocialUser } from '../../interfaces/social/social-auth.interface';

/**
 * Interfaz base para todos los adaptadores de OAuth
 * Implementa el patrón Adapter para transformar respuestas
 * específicas de cada proveedor a un modelo de dominio unificado
 */
export abstract class BaseSocialAdapter<T> {
  /**
   * Transforma la respuesta cruda del proveedor a SocialUser
   */
  abstract adapt(response: T): SocialUser;

  /**
   * Valida que la respuesta contenga los campos requeridos
   */
  abstract validate(response: T): boolean;

  /**
   * Extrae el email verificado (si el proveedor lo soporta)
   */
  abstract isEmailVerified(response: T): boolean;
}
