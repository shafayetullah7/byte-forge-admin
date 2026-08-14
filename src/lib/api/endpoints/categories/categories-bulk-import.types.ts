export type BulkImportCategoryRowStatus = "ready" | "warning" | "error" | "skipped" | "created";

export interface BulkImportTranslationRecord {
  en: { name: string; description?: string | null };
  bn?: { name: string; description?: string | null };
}

export interface BulkImportCategoryInput {
  slug: string;
  parentSlug?: string | null;
  isActive?: boolean;
  commissionRate?: number;
  translations: BulkImportTranslationRecord;
  children?: BulkImportCategoryInput[];
}

export interface BulkImportCategoriesPayload {
  items: BulkImportCategoryInput[];
  options: {
    dryRun: boolean;
    onDuplicate: "skip" | "error";
  };
}

export interface BulkImportCategoriesSummary {
  created: number;
  skipped: number;
  errors: number;
  categoriesCreated: number;
}

export interface BulkImportCategoriesRowResult {
  ref: string;
  entity: "category";
  slug: string;
  status: "created" | "skipped" | "error";
  id?: string;
  message?: string;
}

export interface BulkImportCategoriesResult {
  dryRun: boolean;
  success: boolean;
  summary: BulkImportCategoriesSummary;
  results: BulkImportCategoriesRowResult[];
}

export interface PreviewCategoryRow {
  ref: string;
  slug: string;
  parentSlug: string | null;
  parentPath: string;
  depth: number;
  nameEn: string;
  nameBn: string;
  isActive: boolean;
  status: BulkImportCategoryRowStatus;
  message?: string;
}
