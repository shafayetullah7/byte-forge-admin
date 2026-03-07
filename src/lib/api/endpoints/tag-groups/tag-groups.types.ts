// ─── Tag Group ────────────────────────────────────────────────────────────────

import type { Tag } from "../tags";

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
  slug: string;
  isActive?: boolean;
  translations: [
    { locale: 'en'; name: string; description?: string | null },
    { locale: 'bn'; name: string; description?: string | null }
  ]; // Backend strictly requires 'en' and 'bn' for Tag Groups
  tags?: {
    slug: string;
    isActive?: boolean;
    translations: [
        { locale: 'en'; name: string; description?: string | null },
        { locale: 'bn'; name: string; description?: string | null }
    ];
  }[];
}

/** Request DTO: PATCH /admin/tag-groups/:id */
export interface UpdateTagGroupDto {
  slug?: string;
  isActive?: boolean;
}

/**
 * Response entity: tag group row.
 * `name` is extracted from the English locale translation.
 * `tags` contains up to 3 active child tags (embedded on the list endpoint).
 */
export interface TagGroup {
  id: string;
  slug: string;
  name: string | null;
  isActive: boolean;
  tagCount?: number;  // Only present on list endpoint
  tags?: Tag[];       // Embedded active tags (up to 3)
  translations: TagGroupTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface TagGroupTranslation {
  tagGroupId: string;
  locale: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertTagGroupTranslationDto {
  locale: string;
  name: string;
  description?: string;
}
