

export const environments = {
  baseUrl: 'https://fernando-herrera.com/api',
  oauth: {
    google: {
      issuer: 'https://accounts.google.com',
      clientId: 'YOUR_GOOGLE_CLIENT_ID_HERE',
      redirectUri: window.location.origin,
      scope: 'openid profile email',
      responseType: 'id_token',
      showDebugInformation: false,
      strictDiscoveryDocumentValidation: false,
      skipIssuerCheck: true,
      customQueryParams: {
        prompt: 'consent',
      }
    },
    facebook: {
      issuer: 'https://www.facebook.com',
      clientId: 'YOUR_FACEBOOK_CLIENT_ID_HERE',
      redirectUri: window.location.origin,
      scope: 'email public_profile',
      responseType: 'token',
      showDebugInformation: false,
      strictDiscoveryDocumentValidation: false,
      oidc: false,
    }
  }
}
