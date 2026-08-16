import { createHash, randomBytes } from "node:crypto";
import type { OidcClientConfig } from "./oidc-config";

export interface OidcTokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
}

export function generateCodeVerifier(): string {
  return randomBytes(32).toString("base64url");
}

export function generateCodeChallenge(verifier: string): string {
  return createHash("sha256").update(verifier).digest("base64url");
}

export function generateOidcState(): string {
  return randomBytes(16).toString("hex");
}

export function buildAuthorizeUrl(
  config: OidcClientConfig,
  params: { verifier: string; state: string; nonce?: string },
): string {
  const challenge = generateCodeChallenge(params.verifier);
  const nonce = params.nonce ?? randomBytes(16).toString("hex");
  const search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid profile email",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: params.state,
    nonce,
  });

  if (config.defaultResource) {
    search.set("resource", config.defaultResource);
  }

  return `${config.issuer.replace(/\/$/, "")}/auth?${search.toString()}`;
}

export async function exchangeAuthorizationCode(
  config: OidcClientConfig,
  code: string,
  verifier: string,
): Promise<OidcTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code,
    code_verifier: verifier,
  });

  const response = await fetch(`${config.issuer.replace(/\/$/, "")}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OIDC token exchange failed (${response.status}): ${errorBody}`);
  }

  return (await response.json()) as OidcTokenResponse;
}

export async function refreshOidcTokens(
  config: OidcClientConfig,
  refreshToken: string,
): Promise<OidcTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(`${config.issuer.replace(/\/$/, "")}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OIDC refresh failed (${response.status}): ${errorBody}`);
  }

  return (await response.json()) as OidcTokenResponse;
}

export function buildOidcLogoutUrl(
  issuer: string,
  idTokenHint?: string,
  postLogoutRedirectUri?: string,
): string {
  const url = new URL(`${issuer.replace(/\/$/, "")}/session/end`);
  if (idTokenHint) {
    url.searchParams.set("id_token_hint", idTokenHint);
  }
  if (postLogoutRedirectUri) {
    url.searchParams.set(
      "post_logout_redirect_uri",
      postLogoutRedirectUri,
    );
  }
  return url.toString();
}
