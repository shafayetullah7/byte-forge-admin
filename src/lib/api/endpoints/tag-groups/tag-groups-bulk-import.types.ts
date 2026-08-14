export type BulkImportRowStatus = "ready" | "warning" | "error" | "skipped" | "created";

export type BulkImportEntity = "tag_group" | "tag";

export interface BulkImportTagGroupsOptions {
  dryRun: boolean;
  onDuplicate: "skip" | "error";
}

export interface BulkImportTagGroupsPayload {
  groups: BulkImportTagGroupInput[];
  options: BulkImportTagGroupsOptions;
}

export interface BulkImportTranslationRecord {
  en: { name: string; description?: string | null };
  bn: { name: string; description?: string | null };
}

export interface BulkImportTagInput {
  slug: string;
  isActive?: boolean;
  translations: BulkImportTranslationRecord;
}

export interface BulkImportTagGroupInput {
  slug: string;
  isActive?: boolean;
  existing?: boolean;
  translations?: BulkImportTranslationRecord;
  tags?: BulkImportTagInput[];
}

export interface BulkImportTagGroupsSummary {
  created: number;
  skipped: number;
  errors: number;
  groupsCreated: number;
  tagsCreated: number;
}

export interface BulkImportTagGroupsRowResult {
  ref: string;
  entity: BulkImportEntity;
  slug: string;
  status: "created" | "skipped" | "error";
  id?: string;
  message?: string;
}

export interface BulkImportTagGroupsResult {
  dryRun: boolean;
  success: boolean;
  summary: BulkImportTagGroupsSummary;
  results: BulkImportTagGroupsRowResult[];
}

export interface PreviewTagRow {
  ref: string;
  groupSlug: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  isActive: boolean;
  status: BulkImportRowStatus;
  message?: string;
}

export interface PreviewGroupRow {
  ref: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  isActive: boolean;
  existing: boolean;
  status: BulkImportRowStatus;
  message?: string;
  tags: PreviewTagRow[];
}
