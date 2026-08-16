import { fetcher } from "../api-client";
import type {
  AdminUser,
  CompleteAdminRegistrationDto,
  LoginLocalAdminDto,
  LoginResponse,
  RegisterLocalAdminDto,
  RequestAdminRegistrationOtpResponse,
} from "../types";

export const authApi = {
  login: async (data: LoginLocalAdminDto): Promise<LoginResponse> => {
    return fetcher<LoginResponse>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      strict: false,
    });
  },

  requestRegistrationOtp: async (
    data: RegisterLocalAdminDto
  ): Promise<RequestAdminRegistrationOtpResponse> => {
    return fetcher<RequestAdminRegistrationOtpResponse>(
      "/admin/auth/register/request-otp",
      {
        method: "POST",
        body: JSON.stringify(data),
        strict: false,
      }
    );
  },

  completeRegistration: async (
    data: CompleteAdminRegistrationDto
  ): Promise<AdminUser> => {
    return fetcher<AdminUser>("/admin/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      strict: false,
    });
  },

  checkAuth: async (headers?: HeadersInit): Promise<AdminUser> => {
    return fetcher<AdminUser>("/admin/auth/check", {
      headers,
      strict: false,
    });
  },

  oidcCheck: async (headers?: HeadersInit): Promise<AdminUser> => {
    return fetcher<AdminUser>("/admin/auth/oidc-check", {
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
