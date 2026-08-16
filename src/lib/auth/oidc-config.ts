export type OidcClientConfig = {
  issuer: string;
  clientId: string;
  redirectUri: string;
  defaultResource?: string;
  cookiePrefix: "bf" | "bfAdmin";
};

const adminConfig: OidcClientConfig = {
  issuer: process.env.OIDC_ISSUER || "http://localhost:3010",
  clientId: process.env.OIDC_CLIENT_ID || "byte-forge-admin",
  redirectUri:
    process.env.OIDC_REDIRECT_URI || "http://localhost:3050/auth/callback",
  defaultResource:
    process.env.OIDC_DEFAULT_RESOURCE || "http://localhost:3005",
  cookiePrefix: "bfAdmin",
};

export function getOidcConfig(): OidcClientConfig {
  return adminConfig;
}

export function getPublicOidcConfig() {
  return {
    issuer: import.meta.env.VITE_OIDC_ISSUER || "http://localhost:3010",
    oidcLoginEnabled: import.meta.env.VITE_OIDC_LOGIN_ENABLED !== "false",
    legacyLoginEnabled: import.meta.env.VITE_LEGACY_LOGIN_ENABLED !== "false",
  };
}
