import { deleteCookie, getCookie, setCookie } from "vinxi/http";
import type { HTTPEvent } from "vinxi/http";
import type { OidcClientConfig } from "./oidc-config";
import type { OidcTokenResponse } from "./oidc";

function cookieNames(prefix: OidcClientConfig["cookiePrefix"]) {
  return {
    verifier: `${prefix}OidcVerifier`,
    state: `${prefix}OidcState`,
    accessToken: `${prefix}AccessToken`,
    refreshToken: `${prefix}RefreshToken`,
    idToken: `${prefix}IdToken`,
    xsrf: `${prefix}-xsrf-token`,
    returnTo: `${prefix}OidcReturnTo`,
  };
}

export function setPkceCookies(
  event: HTTPEvent,
  config: OidcClientConfig,
  verifier: string,
  state: string,
  returnTo?: string,
): void {
  const names = cookieNames(config.cookiePrefix);
  const pkceOptions = {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };

  setCookie(event, names.verifier, verifier, pkceOptions);
  setCookie(event, names.state, state, pkceOptions);

  if (returnTo) {
    setCookie(event, names.returnTo, returnTo, pkceOptions);
  }
}

export function readPkceCookies(event: HTTPEvent, config: OidcClientConfig) {
  const names = cookieNames(config.cookiePrefix);
  return {
    verifier: getCookie(event, names.verifier),
    state: getCookie(event, names.state),
    returnTo: getCookie(event, names.returnTo),
  };
}

export function clearPkceCookies(event: HTTPEvent, config: OidcClientConfig) {
  const names = cookieNames(config.cookiePrefix);
  for (const name of [names.verifier, names.state, names.returnTo]) {
    deleteCookie(event, name, { path: "/" });
  }
}

export function setOidcSessionCookies(
  event: HTTPEvent,
  config: OidcClientConfig,
  tokens: OidcTokenResponse,
): void {
  const names = cookieNames(config.cookiePrefix);
  const accessMaxAge = tokens.expires_in ?? 900;
  const refreshMaxAge = 60 * 60 * 24 * 7;

  setCookie(event, names.accessToken, tokens.access_token, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    sameSite: "lax",
    path: "/",
    maxAge: accessMaxAge,
  });

  if (tokens.refresh_token) {
    setCookie(event, names.refreshToken, tokens.refresh_token, {
      httpOnly: true,
      secure: !import.meta.env.DEV,
      sameSite: "lax",
      path: "/",
      maxAge: refreshMaxAge,
    });
  }

  if (tokens.id_token) {
    setCookie(event, names.idToken, tokens.id_token, {
      httpOnly: true,
      secure: !import.meta.env.DEV,
      sameSite: "lax",
      path: "/",
      maxAge: refreshMaxAge,
    });
  }

  const xsrf = crypto.randomUUID();
  setCookie(event, names.xsrf, xsrf, {
    httpOnly: false,
    secure: !import.meta.env.DEV,
    sameSite: "lax",
    path: "/",
    maxAge: refreshMaxAge,
  });
}

export function clearOidcSessionCookies(
  event: HTTPEvent,
  config: OidcClientConfig,
): void {
  const names = cookieNames(config.cookiePrefix);
  for (const name of Object.values(names)) {
    deleteCookie(event, name, { path: "/" });
  }
}

export function getOidcAccessTokenCookieName(
  config: OidcClientConfig,
): string {
  return cookieNames(config.cookiePrefix).accessToken;
}
