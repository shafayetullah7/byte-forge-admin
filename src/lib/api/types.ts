/**
 * Standard API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: any = null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Admin User profile interface
 */
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  avatar: string | null;
}

/**
 * Auth Token wrapper
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Login credentials
 */
export interface LoginLocalAdminDto {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponse {
  tokens: AuthTokens;
  admin: AdminUser;
}
