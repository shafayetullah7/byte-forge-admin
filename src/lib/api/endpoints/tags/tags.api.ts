import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { Tag, TagListParams, TagTranslation } from "./tags.types";
import type { PaginatedResponse } from "../../types";

// ─── Tags ────────────────────────────────────────────────────────────────────

/**
 * Fetch all tags within a specific tag group, scoped by groupId.
 * Endpoint: GET /admin/tag-groups/:groupId/tags
 */
export const getTagsByGroup = query(async (params: TagListParams) => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.isActive !== undefined)
    searchParams.set("isActive", params.isActive.toString());
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  const qs = searchParams.toString();
  const url = qs
    ? `/admin/tag-groups/${params.groupId}/tags?${qs}`
    : `/admin/tag-groups/${params.groupId}/tags`;

  const result = await apiClient<PaginatedResponse<Tag>>(url, {
    unwrapData: false,
  });
  return (result.data as Tag[]) || [];
}, "tags-by-group");

/**
 * Retrieve a single Tag by ID
 */
export async function getTagDetail(id: string): Promise<Tag> {
  const result = await apiClient<Tag>(`/admin/tags/${id}`, {
    method: "GET",
  });
  return result;
}

// ─── Tag Translations ─────────────────────────────────────────────────────────

/**
 * Get all translations for a Tag
 */
export async function getTagTranslations(
  tagId: string
): Promise<TagTranslation[]> {
  const result = await apiClient<TagTranslation[]>(
    `/admin/tags/${tagId}/translations`,
    {
      method: "GET",
    }
  );
  return result;
}
