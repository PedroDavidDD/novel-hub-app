export const environments = {
  baseUrl: 'http://localhost:3000',

  oauth: {
    google: {
      issuer: 'https://accounts.google.com',
      clientId: '1052425716139-nrq8cm3et4tbthuo87c9ak3pif0dumeo.apps.googleusercontent.com',
      redirectUri: window.location.origin + '',
      scope: 'openid profile email',
      responseType: 'id_token token',
      showDebugInformation: true,
      strictDiscoveryDocumentValidation: false,
      customQueryParams: {
        prompt: 'consent',     // 'select_account' | 'consent' | 'none'
      }
    },
    facebook: {
      issuer: 'https://www.facebook.com',
      clientId: '',
      redirectUri: window.location.origin + '/#/home',
      scope: 'email public_profile',
      responseType: 'token',
      showDebugInformation: true,
      strictDiscoveryDocumentValidation: false,
      oidc: false,
    }
  }
};
