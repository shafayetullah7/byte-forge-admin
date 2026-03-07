// ─── Category Translations ──────────────────────────────────────────────────

/** Base link between category and locale data */
export interface CategoryTranslation {
  id: string;          // Required for response
  categoryId: string;  
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload for POST/PATCH translations */
export interface UpsertCategoryTranslationDto {
    locale: string;
    name: string;
    description?: string | null;
}

// ─── Category DTOs ───────────────────────────────────────────────────────────

/** Request DTO: POST /admin/categories */
export interface CreateCategoryDto {
  slug: string;
  parentId?: string | null;   // UUID — optional, creates a root category if omitted
  isActive?: boolean;
  commissionRate?: number;    // 0–100, stored as decimal(5,2)
  translations: UpsertCategoryTranslationDto[]; // Use the lean DTO here
}

/** Request DTO: PATCH /admin/categories/:id */
export interface UpdateCategoryDto {
  slug?: string;
  parentId?: string | null;
  isActive?: boolean;
  commissionRate?: number;
  translations?: UpsertCategoryTranslationDto[];
}

/**
 * Response entity: flat category row (list endpoint and base shape).
 * `commissionRate` is returned as a string from Postgres decimal type;
 * parse before arithmetic: `Number(commissionRate)`.
 */
export interface Category {
  id: string;
  name: string; // English resolved name from backend
  slug: string;
  description: string | null;
  isActive: boolean;
  commissionRate: string | null; // Postgres decimal → string
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  translations: CategoryTranslation[];
}

/** Tree node: returned by GET /admin/categories/tree */
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  parentId: string | null;
  depth: number;
  childrenCount: number;
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
  childrenCount: number; 
}

export interface CategoryParentOption {
  id: string;
  name: string;
}
