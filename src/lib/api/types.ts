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
 * Standard API response wrapper for paginated lists
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

/** List Query Params: GET /admin/tag-groups */
export interface TagGroupListParams {
  search?: string;
  id?: string;
  name?: string;
  isActive?: 'true' | 'false';
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  page?: number;
  limit?: number;
}

/** Request DTO: POST /admin/tag-groups */
export interface CreateTagGroupDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

/** Request DTO: PATCH /admin/tag-groups/:id */
export interface UpdateTagGroupDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

/** 
 * Response entity: tag group row.
 * Note: no `slug` column — name is used directly.
 * `tagCount` is a computed field added by `findAll`.
 */
export interface TagGroup {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  tagCount?: number;        // Only present on list endpoint
  tags?: Tag[];             // Only present on detail endpoint
  createdAt: string;
  updatedAt: string;
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

/** List Query Params: GET /admin/tags */
export interface TagListParams {
  groupId?: string;
  search?: string;
  id?: string;
  name?: string;
  isActive?: 'true' | 'false';
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  page?: number;
  limit?: number;
}

/** Request DTO: POST /admin/tags */
export interface CreateTagDto {
  groupId: string;          // UUID — required, must reference an existing TagGroup
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

/** Request DTO: PATCH /admin/tags/:id */
export interface UpdateTagDto {
  groupId?: string;         // Optional reparent — backend validates the target group exists
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Response entity: tag row.
 * `groupId` is the FK column name (not `tagGroupId`).
 */
export interface Tag {
  id: string;
  groupId: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

/** Request DTO: POST /admin/categories */
export interface CreateCategoryDto {
  name: string;
  slug: string;
  parentId?: string;        // UUID — optional, creates a root category if omitted
  description?: string;
  isActive?: boolean;
  commissionRate?: number;  // 0–100, stored as decimal(5,2)
}

/** Request DTO: PATCH /admin/categories/:id */
export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  parentId?: string;
  description?: string;
  isActive?: boolean;
  commissionRate?: number;
}

/**
 * Response entity: flat category row (list endpoint and base shape).
 * `commissionRate` is returned as a string from Postgres decimal type;
 * parse before arithmetic: `Number(commissionRate)`.
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  commissionRate: string | null; // Postgres decimal → string
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Tree node: returned by GET /admin/categories/tree */
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  parentId: string | null;
  depth: number;
  subCategoryCount: number;
  children: CategoryNode[];
}

/** Detail response: returned by GET /admin/categories/:id */
export interface CategoryDetail extends Category {
  depth: number;
  parentId: string | null;
  parentName: string | null;
  children: CategoryChildSummary[];
  parentOptions: CategoryParentOption[];
}

export interface CategoryChildSummary {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  subCategoryCount: number;
}

export interface CategoryParentOption {
  id: string;
  name: string;
}
