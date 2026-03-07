"use action";
import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  Tag,
  CreateTagDto,
  UpdateTagDto,
  TagTranslation,
  UpsertTagTranslationDto,
} from "./tags.types";

// ─── Tags ────────────────────────────────────────────────────────────────────

/**
 * Create a new tag strictly within a group.
 * Endpoint: POST /admin/tag-groups/:groupId/tags
 */
export const createTag = action(async (groupId: string, data: CreateTagDto) => {
  const result = await apiClient<Tag>(`/admin/tag-groups/${groupId}/tags`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidate("tag-groups");
  revalidate(["tag-group-detail", groupId]);
  return result;
}, "create-tag");

/**
 * Update an existing tag's slug, active status, or reparent to another group.
 * Endpoint: PATCH /admin/tags/:id
 */
export const updateTag = action(
  async (id: string, data: UpdateTagDto, groupId?: string) => {
    const result = await apiClient<Tag>(`/admin/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidate("tag-groups");
    if (groupId) {
      revalidate(["tag-group-detail", groupId]);
    }
    return result;
  },
  "update-tag"
);

/**
 * Soft-delete a tag.
 * Endpoint: DELETE /admin/tags/:id
 */
export const deleteTag = action(async (id: string) => {
  const result = await apiClient<void>(`/admin/tags/${id}`, {
    method: "DELETE",
  });
  revalidate("tag-groups");
  revalidate("tag-group-detail");
  return result;
}, "delete-tag");

// ─── Tag Translations ─────────────────────────────────────────────────────────

/**
 * Upsert a translation for a Tag (Create or Update)
 */
export const upsertTagTranslation = action(
  async (tagId: string, data: UpsertTagTranslationDto) => {
    const result = await apiClient<TagTranslation>(
      `/admin/tags/${tagId}/translations`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    // Revalidate tag groups since translations affect display
    revalidate("tag-groups");
    revalidate("tags-by-group");
    return result;
  },
  "upsert-tag-translation"
);

/**
 * Delete a specific translation locale from a Tag
 */
export const deleteTagTranslation = action(
  async (tagId: string, locale: string) => {
    const result = await apiClient<void>(
      `/admin/tags/${tagId}/translations/${locale}`,
      {
        method: "DELETE",
      }
    );
    revalidate("tag-groups");
    revalidate("tags-by-group");
    return result;
  },
  "delete-tag-translation"
);
