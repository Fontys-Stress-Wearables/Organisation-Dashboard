import { AUTH_AUTHORITY, AUTH_CLIENT_ID, AUTH_REDIRECT_URI } from './utilities/environment';

export const msalConfig = {
  auth: {
    clientId: AUTH_CLIENT_ID,
    authority: AUTH_AUTHORITY, // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: AUTH_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"]
};

export const appRoles = {
  Admin: "Organization.Admin"
}