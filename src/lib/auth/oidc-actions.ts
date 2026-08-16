import { action } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import {
  buildAuthorizeUrl,
  exchangeAuthorizationCode,
  generateCodeVerifier,
  generateOidcState,
  refreshOidcTokens,
} from "./oidc";
import { getOidcConfig } from "./oidc-config";
import {
  clearOidcSessionCookies,
  clearPkceCookies,
  readPkceCookies,
  setOidcSessionCookies,
  setPkceCookies,
} from "./oidc-cookies.server";

export const startOidcLogin = action(async (returnTo?: string) => {
  "use server";

  const event = getRequestEvent();
  if (!event) {
    throw new Error("OIDC login requires a server request context");
  }

  const config = getOidcConfig();
  const verifier = generateCodeVerifier();
  const state = generateOidcState();
  const authorizeUrl = buildAuthorizeUrl(config, { verifier, state });

  setPkceCookies(event.nativeEvent, config, verifier, state, returnTo);

  return { authorizeUrl };
}, "admin-start-oidc-login");

export const completeOidcCallback = action(
  async (params: { code?: string; state?: string; error?: string }) => {
    "use server";

    const event = getRequestEvent();
    if (!event) {
      throw new Error("OIDC callback requires a server request context");
    }

    const config = getOidcConfig();

    if (params.error) {
      clearPkceCookies(event.nativeEvent, config);
      return { success: false as const, error: params.error };
    }

    if (!params.code || !params.state) {
      return { success: false as const, error: "missing_code" };
    }

    const pkce = readPkceCookies(event.nativeEvent, config);
    if (!pkce.verifier || !pkce.state || pkce.state !== params.state) {
      clearPkceCookies(event.nativeEvent, config);
      return { success: false as const, error: "invalid_state" };
    }

    try {
      const tokens = await exchangeAuthorizationCode(
        config,
        params.code,
        pkce.verifier,
      );
      setOidcSessionCookies(event.nativeEvent, config, tokens);
      clearPkceCookies(event.nativeEvent, config);

      return {
        success: true as const,
        returnTo: pkce.returnTo || "/",
      };
    } catch (error) {
      clearPkceCookies(event.nativeEvent, config);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "token_exchange_failed",
      };
    }
  },
  "admin-complete-oidc-callback",
);

export const refreshOidcSession = action(async () => {
  "use server";

  const event = getRequestEvent();
  if (!event) {
    throw new Error("OIDC refresh requires a server request context");
  }

  const config = getOidcConfig();
  const refreshToken = event.request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)bfAdminRefreshToken=([^;]*)/)?.[1];

  if (!refreshToken) {
    return { success: false as const };
  }

  try {
    const tokens = await refreshOidcTokens(config, decodeURIComponent(refreshToken));
    setOidcSessionCookies(event.nativeEvent, config, tokens);
    return { success: true as const };
  } catch {
    clearOidcSessionCookies(event.nativeEvent, config);
    return { success: false as const };
  }
}, "admin-refresh-oidc-session");
