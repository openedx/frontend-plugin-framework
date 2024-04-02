export class NullAuthService {
    constructor() {
    }
  
    applyMiddleware() {}
  
    getAuthenticatedHttpClient() {}
  
    getHttpClient() {}
  
    getLoginRedirectUrl = () => '/dont/redirect/because/no/login/is/needed';
  
    redirectToLogin() {}
  
    getLogoutRedirectUrl = () => '/dont/redirect/because/no/logout/is/needed';

    redirectToLogout() {}
  
    getAuthenticatedUser() { return null; }
  
    setAuthenticatedUser() {}

    fetchAuthenticatedUser() {}

    ensureAuthenticatedUser() {}

    hydrateAuthenticatedUser() {}
}
