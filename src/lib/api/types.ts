/**
 * Standard API error class
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown = null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Standard API response wrapper for singular records
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Pagination metadata - matches backend PaginationMeta exactly
 * @see byte-forge-auth/src/common/types/pagination.type.ts
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated response wrapper - matches backend PaginatedResult with ResponseService
 * Includes ResponseService wrapper (success, message)
 * @see byte-forge-auth/src/common/types/pagination.type.ts
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

/**
 * Simplified paginated result (without ResponseService wrapper)
 * Use when backend returns raw PaginatedResult
 * @see byte-forge-auth/src/common/types/pagination.type.ts
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
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

// ─── Tag Group ───────────────────────────────────────────────────────────────
// Types moved to: ~/lib/api/endpoints/tag-groups/tag-groups.types.ts
export type { TagGroupListParams, CreateTagGroupDto, UpdateTagGroupDto, TagGroup } from "./endpoints/tag-groups/tag-groups.types";

// ─── Tag ─────────────────────────────────────────────────────────────────────
// Types moved to: ~/lib/api/endpoints/tags/tags.types.ts
export type { TagListParams, CreateTagDto, UpdateTagDto, Tag } from "./endpoints/tags/tags.types";

// ─── Category ────────────────────────────────────────────────────────────────
// Types moved to: ~/lib/api/endpoints/categories/categories.types.ts
export type {
    CreateCategoryDto,
    UpdateCategoryDto,
    Category,
    CategoryNode,
    CategoryDetail,
    CategoryChildSummary,
    CategoryParentOption,
} from "./endpoints/categories/categories.types";
