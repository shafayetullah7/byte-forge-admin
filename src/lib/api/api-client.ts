import { ApiError } from "./types";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  strict?: boolean; // If true, redirects to /login on 401. Default: true
  responseType?: "json" | "blob" | "text";
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? (() => {
        throw new Error("VITE_API_BASE_URL is required in production");
      })()
    : "http://localhost:3005/api/v1");

/**
 * Build URL with query parameters
 */
export const buildURL = (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string => {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = new URL(path, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

/**
 * Utility to extract a cookie from a cookie string
 */
function getCookieFromStr(cookieStr: string, name: string): string | undefined {
  if (!cookieStr) return undefined;

  // Handle both cases: cookie at start and cookie in middle/end
  const regex = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`);
  const match = cookieStr.match(regex);
  return match ? match[1] : undefined;
}

/**
 * Universal cookie getter (Works in Browser and during SSR)
 */
function getUniversalCookie(
  name: string,
  headers?: Headers
): string | undefined {
  // Browser: read from document.cookie
  if (typeof window !== "undefined") {
    return getCookieFromStr(document.cookie, name);
  }

  // SSR/Node: Try headers first
  if (headers) {
    const cookieHeader = headers.get("cookie");
    if (cookieHeader) return getCookieFromStr(cookieHeader, name);
  }

  return undefined;
}

/**
 * Silent Refresh State
 */
let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;

/**
 * Hardened Fetcher with SSR, CSRF, and Binary support
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, strict = true, responseType, ...fetchOptions } = options;
  const url = buildURL(endpoint, params);

  const headers = new Headers(fetchOptions.headers || {});
  if (
    !headers.has("Content-Type") &&
    !(fetchOptions.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  // 1. SSR Context Identification
  let event: any;
  if (import.meta.env.SSR) {
    const { getRequestEvent } = await import("solid-js/web");
    try {
      event = getRequestEvent();
      if (event && !headers.has("cookie")) {
        const cookie = event.request.headers.get("cookie");
        if (cookie) headers.set("cookie", cookie);
      }
    } catch (e) {
      console.warn("[API] SSR event missing", e);
    }
  }

  // 2. Universal CSRF Token injection
  const method = fetchOptions.method?.toUpperCase() || "GET";
  const stateChangingMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (stateChangingMethods.includes(method)) {
    const xsrfToken = getUniversalCookie("xsrf-token", headers);
    if (xsrfToken) headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  const makeRequest = (opts: RequestInit, currentHeaders: Headers) =>
    fetch(url, {
      ...opts,
      headers: currentHeaders,
      credentials: "include",
    });

  try {
    let response = await makeRequest(fetchOptions, headers);

    // 3. Silent Refresh & Token Rotation Handling
    const isAuthRoute =
      endpoint.startsWith("/admin/auth/login") ||
      endpoint.startsWith("/admin/auth/refresh");

    if (response.status === 401 && strict && !isAuthRoute) {
      // 3.1 Deduplicate refresh calls and prevent infinite retries
      if (!isRefreshing && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
        isRefreshing = true;
        refreshAttempts++;
        refreshPromise = fetch(`${API_BASE_URL}/admin/auth/refresh`, {
          method: "POST",
          credentials: "include",
        }).finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      // 3.2 Wait for refresh to complete if a refresh is in progress
      if (refreshPromise) {
        const refreshResponse = await refreshPromise;

        if (refreshResponse?.ok) {
          // Reset counter on successful refresh
          refreshAttempts = 0;

          // ROTATION: Clone headers for retry safety and update XSRF token
          const retryHeaders = new Headers(headers);
          const newXsrfToken = getUniversalCookie("xsrf-token", retryHeaders);

          if (newXsrfToken && stateChangingMethods.includes(method)) {
            retryHeaders.set("X-XSRF-TOKEN", newXsrfToken);
          }

          response = await makeRequest(fetchOptions, retryHeaders);
        } else {
          // 3.3 Terminal Auth Failure: Reset counter and redirect
          refreshAttempts = 0;

          // For server-side: use redirect
          if (import.meta.env.SSR) {
            const { redirect } = await import("@solidjs/router");
            throw redirect("/login");
          }

          // For client-side: navigate
          if (typeof window !== "undefined") {
            window.location.href = "/login";
            return {} as T;
          }
        }
      }
    }

    // 4. SSR Cookie Propagation
    if (import.meta.env.SSR && event) {
      try {
        const { appendResponseHeader } = await import("vinxi/http");
        // FIX: Prevent ERR_HTTP_HEADERS_SENT by checking if headers are already dispatched
        const isResponseFinished =
          event.nativeEvent.node.res.headersSent ||
          event.nativeEvent.node.res.writableEnded;

        if (!isResponseFinished) {
          // Proper type casting for getSetCookie
          let setCookies: string[] = [];
          const headersAny = response.headers as unknown as {
            getSetCookie?: () => string[];
          };
          if (typeof headersAny.getSetCookie === "function") {
            setCookies = headersAny.getSetCookie();
          }

          setCookies.forEach((cookie: string) => {
            appendResponseHeader(event.nativeEvent, "Set-Cookie", cookie);
          });
        }
      } catch (e) {
        console.warn("[API] Cookie sync failed", e);
      }
    }

    // 5. Error Normalization
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `API Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    if (response.status === 204) return {} as T;

    // 6. Polymorphic Body Parsing
    if (responseType === "blob") {
      return (await response.blob()) as unknown as T;
    }

    if (responseType === "text") {
      return (await response.text()) as unknown as T;
    }

    // Default to JSON with automatic unwrapping
    const result = await response.json().catch(() => ({}));
    if (
      result &&
      typeof result === "object" &&
      "success" in result &&
      "data" in result
    ) {
      return result.data as T;
    }
    return result as T;
  } catch (error) {
    if (error instanceof Response || error instanceof ApiError) throw error;
    throw new ApiError(
      error instanceof Error ? error.message : "Network request failed",
      0
    );
  }
}

export const apiClient = fetcher;
