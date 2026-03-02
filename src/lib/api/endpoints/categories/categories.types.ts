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
