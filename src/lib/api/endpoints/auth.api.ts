import { fetcher } from "../api-client";
import type { AdminUser, LoginResponse, LoginLocalAdminDto } from "../types";

/**
 * Check if the admin is currently authenticated
 */
export const checkAuth = async (): Promise<AdminUser> => {
  return fetcher<AdminUser>("/admin/auth/check");
};

/**
 * Login admin
 */
export const loginAdmin = async (body: LoginLocalAdminDto): Promise<LoginResponse> => {
  return fetcher<LoginResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/**
 * Logout admin
 */
export const logoutAdmin = async (): Promise<void> => {
  return fetcher<void>("/admin/auth/logout", {
    method: "POST",
  });
};

