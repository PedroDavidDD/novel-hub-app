import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { environments } from '../../../../../environments/environments';

/**
 * Configuración de OAuth para diferentes proveedores
 * Usa angular-oauth2-oidc para manejar el flujo OAuth2/OIDC
 */
@Injectable({ providedIn: 'root' })
export class OAuthConfigService {

  /**
   * Obtiene la configuración de OAuth para Google
   */
  getGoogleConfig(): AuthConfig {
    const config = environments.oauth.google;
    return {
      issuer: config.issuer,
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scope: config.scope,
      responseType: config.responseType,
      showDebugInformation: config.showDebugInformation,
      strictDiscoveryDocumentValidation: config.strictDiscoveryDocumentValidation,
      skipIssuerCheck: true,
      customQueryParams: config.customQueryParams
    };
  }

  /**
   * Obtiene la configuración de OAuth para Facebook
   * Facebook usa OAuth2 puro (no OIDC)
   */
  getFacebookConfig(): AuthConfig {
    const config = environments.oauth.facebook;
    return {
      issuer: config.issuer,
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scope: config.scope,
      responseType: config.responseType,
      showDebugInformation: config.showDebugInformation,
      strictDiscoveryDocumentValidation: config.strictDiscoveryDocumentValidation,
      oidc: config.oidc,
      skipIssuerCheck: true,
      loginUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenEndpoint: 'https://graph.facebook.com/v18.0/oauth/access_token'
    };
  }
}
