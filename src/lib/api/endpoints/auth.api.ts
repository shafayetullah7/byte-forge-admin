import { fetcher } from "../api-client";
import type { AdminUser, LoginLocalAdminDto, LoginResponse } from "../types";

export const authApi = {
  login: async (data: LoginLocalAdminDto): Promise<LoginResponse> => {
    return fetcher<LoginResponse>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  checkAuth: async (headers?: HeadersInit): Promise<AdminUser> => {
    return fetcher<AdminUser>("/admin/auth/check", {
      headers,
      strict: false,
    });
  },

  logout: async (): Promise<void> => {
    return fetcher<void>("/admin/auth/logout", {
      method: "POST",
    });
  },
};
