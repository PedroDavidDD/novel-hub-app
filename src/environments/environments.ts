

export const environments = {
  baseUrl: 'http://localhost:3000',

  oauth: {
    google: {
      clientId: '',
      redirectUri: 'http://localhost:4200/#/auth/callback',
      scopes: ['openid', 'email', 'profile'],
      uxMode: 'popup' as const
    },
    facebook: {
      appId: '',
      version: 'v18.0',
      scopes: ['email', 'public_profile'],
      fields: ['id', 'email', 'name', 'picture']
    }
  }
}
