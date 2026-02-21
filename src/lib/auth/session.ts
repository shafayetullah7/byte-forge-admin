import { query, createAsync } from "@solidjs/router";
import { authApi } from "~/lib/api/endpoints/auth.api";

/**
 * Session Management for ByteForge Admin
 * Aligned with ByteForge Frontend patterns.
 */

/**
 * Server-side session loader
 */
export const getSession = query(async () => {
  "use server";
  try {
    return await authApi.checkAuth();
  } catch (error) {
    // Fail silently for session checks
    return null;
  }
}, "admin-session");

/**
 * Perform a logout operation
 */
export const performLogout = async () => {
  const { revalidate } = await import("@solidjs/router");

  try {
    await authApi.logout();
  } catch (error: any) {
    if (error?.statusCode !== 401) {
      console.error("[Auth] Logout error:", error);
    }
  } finally {
    await revalidate("admin-session");
  }

  return true;
};

/**
 * Hook to access the current session
 */
export const useSession = () => createAsync(() => getSession());
