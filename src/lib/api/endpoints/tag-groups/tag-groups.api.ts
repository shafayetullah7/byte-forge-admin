import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  TagGroup,
  TagGroupListParams,
  TagGroupTranslation,
} from "./tag-groups.types";
import type { PaginatedResponse } from "../../types";

/**
 * Fetch tag groups (supports pagination, search, and filtering).
 * Returns the raw data array from the paginated response.
 */
export const getTagGroups = query(async (params?: TagGroupListParams) => {
  const searchParams = new URLSearchParams();
  if (params) {
    if (params.search) searchParams.set("search", params.search);
    if (params.isActive !== undefined)
      searchParams.set("isActive", params.isActive.toString());
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
  }

  const qs = searchParams.toString();
  const url = qs ? `/admin/tag-groups?${qs}` : "/admin/tag-groups";

  const result = await apiClient<PaginatedResponse<TagGroup>>(url, {
    unwrapData: false,
  });
  return result.data as TagGroup[];
}, "tag-groups");

/**
 * Fetch a single tag group (returns group with embedded active tags).
 */
export const getTagGroupDetail = query(async (id: string) => {
  return apiClient<TagGroup>(`/admin/tag-groups/${id}`);
}, "tag-group-detail");

// ─── Tag Group Translations ───────────────────────────────────────────────────

/**
 * Get all translations for a Tag Group
 */
export const getTagGroupTranslations = query(async (groupId: string) => {
  const result = await apiClient<TagGroupTranslation[]>(
    `/admin/tag-groups/${groupId}/translations`,
    {
      method: "GET",
    }
  );
  return result;
}, "tag-group-translations");
