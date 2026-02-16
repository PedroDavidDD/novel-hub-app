/**
 * DTOs específicos de Facebook OAuth 2.0
 * Mapea la respuesta de Facebook SDK
 */
export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  graphDomain: string;
  data_access_expiration_time: number;
}

export interface FacebookUserInfo {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  picture?: {
    data: {
      url: string;
      width: number;
      height: number;
      is_silhouette: boolean;
    };
  };
}

export interface FacebookLoginStatus {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: FacebookAuthResponse;
}

/**
 * Declaración global para Facebook SDK
 */
declare global {
  interface Window {
    FB?: {
      init: (options: any) => void;
      login: (callback: (response: FacebookLoginStatus) => void, options?: any) => void;
      logout: (callback: (response: any) => void) => void;
      api: (path: string, params: any, callback: (response: any) => void) => void;
      getLoginStatus: (callback: (response: FacebookLoginStatus) => void) => void;
    };
  }
}
