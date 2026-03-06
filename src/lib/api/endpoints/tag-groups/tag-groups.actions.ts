import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  TagGroup,
  CreateTagGroupDto,
  UpdateTagGroupDto,
  TagGroupTranslation,
  UpsertTagGroupTranslationDto,
} from "./tag-groups.types";

/**
 * Create a new tag group (supports inline tag creation via translations).
 */
export const createTagGroup = action(async (data: CreateTagGroupDto) => {
  const result = await apiClient<TagGroup>("/admin/tag-groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidate("tag-groups");
  return result;
}, "create-tag-group");

/**
 * Update an existing tag group's slug or active status.
 */
export const updateTagGroup = action(
  async (id: string, data: UpdateTagGroupDto) => {
    const result = await apiClient<TagGroup>(`/admin/tag-groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidate("tag-groups");
    revalidate("tag-group-detail");
    return result;
  },
  "update-tag-group"
);

/**
 * Soft-delete a tag group.
 * Note: Fails if the group still contains active tags.
 */
export const deleteTagGroup = action(async (id: string) => {
  const result = await apiClient<TagGroup>(`/admin/tag-groups/${id}`, {
    method: "DELETE",
  });
  revalidate("tag-groups");
  return result;
}, "delete-tag-group");

// ─── Tag Group Translations ───────────────────────────────────────────────────

/**
 * Upsert a translation for a Tag Group (Create or Update)
 */
export const upsertTagGroupTranslation = action(
  async (groupId: string, data: UpsertTagGroupTranslationDto) => {
    const result = await apiClient<TagGroupTranslation>(
      `/admin/tag-groups/${groupId}/translations`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    revalidate("tag-group-detail");
    revalidate("tag-groups");
    return result;
  },
  "upsert-tag-group-translation"
);

/**
 * Delete a specific translation locale from a Tag Group
 */
export const deleteTagGroupTranslation = action(
  async (groupId: string, locale: string) => {
    const result = await apiClient<void>(
      `/admin/tag-groups/${groupId}/translations/${locale}`,
      {
        method: "DELETE",
      }
    );
    revalidate("tag-group-detail");
    revalidate("tag-groups");
    return result;
  },
  "delete-tag-group-translation"
);
