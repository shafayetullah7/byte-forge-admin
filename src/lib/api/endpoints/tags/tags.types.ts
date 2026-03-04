// ─── Tag ─────────────────────────────────────────────────────────────────────

/** List Query Params: GET /admin/tag-groups/:groupId/tags */
export interface TagListParams {
  groupId: string;
  search?: string;
  id?: string;
  name?: string;
  isActive?: 'true' | 'false';
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  page?: number;
  limit?: number;
}

/** Request DTO: POST /admin/tag-groups/:groupId/tags */
export interface CreateTagDto {
  slug: string;
  isActive?: boolean;
  translations: {
    locale: string;
    name: string;
    description?: string;
  }[];
}

/** Request DTO: PATCH /admin/tags/:id */
export interface UpdateTagDto {
  groupId?: string;  // Optional reparent — backend validates the target group exists
  slug?: string;
  isActive?: boolean;
}

/**
 * Response entity: tag row.
 * `name` is extracted from the English locale translation.
 * `groupId` is the FK column name.
 */
export interface Tag {
  id: string;
  groupId: string;
  name: string | null;
  slug: string;
  isActive: boolean;
  usageCount: number;
  translations: TagTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface TagTranslation {
    tagId: string;
    locale: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UpsertTagTranslationDto {
    locale: string;
    name: string;
    description?: string;
}
