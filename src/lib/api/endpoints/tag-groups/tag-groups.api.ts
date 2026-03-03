import { query, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
    TagGroup,
    TagGroupListParams,
    CreateTagGroupDto,
    UpdateTagGroupDto,
    TagGroupTranslation,
    UpsertTagGroupTranslationDto,
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
        if (params.isActive !== undefined) searchParams.set("isActive", params.isActive.toString());
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
    }

    const qs = searchParams.toString();
    const url = qs ? `/admin/tag-groups?${qs}` : "/admin/tag-groups";

    const result = await apiClient<PaginatedResponse<TagGroup>>(url, { unwrapData: false } as any);
    return result.data as TagGroup[];
}, "tag-groups");

/**
 * Fetch a single tag group (returns group with embedded active tags).
 */
export const getTagGroupDetail = query(async (id: string) => {
    return apiClient<TagGroup>(`/admin/tag-groups/${id}`);
}, "tag-group-detail");

/**
 * Create a new tag group (supports inline tag creation via translations).
 */
export const createTagGroup = async (data: CreateTagGroupDto) => {
    const result = await apiClient<TagGroup>("/admin/tag-groups", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    return result;
};

/**
 * Update an existing tag group's slug or active status.
 */
export const updateTagGroup = async (id: string, data: UpdateTagGroupDto) => {
    const result = await apiClient<TagGroup>(`/admin/tag-groups/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    revalidate("tag-group-detail");
    return result;
};

/**
 * Soft-delete a tag group.
 * Note: Fails if the group still contains active tags.
 */
export const deleteTagGroup = async (id: string) => {
    const result = await apiClient<TagGroup>(`/admin/tag-groups/${id}`, {
        method: "DELETE"
    });
    revalidate("tag-groups");
    return result;
};

// ─── Tag Group Translations ───────────────────────────────────────────────────

/**
 * Get all translations for a Tag Group
 */
export async function getTagGroupTranslations(groupId: string): Promise<TagGroupTranslation[]> {
    const result = await apiClient<TagGroupTranslation[]>(`/admin/tag-groups/${groupId}/translations`, {
        method: "GET",
    });
    return result;
}

/**
 * Upsert a translation for a Tag Group (Create or Update)
 */
export async function upsertTagGroupTranslation(groupId: string, data: UpsertTagGroupTranslationDto): Promise<TagGroupTranslation> {
    const result = await apiClient<TagGroupTranslation>(`/admin/tag-groups/${groupId}/translations`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return result;
}

/**
 * Delete a specific translation locale from a Tag Group
 */
export async function deleteTagGroupTranslation(groupId: string, locale: string): Promise<void> {
    await apiClient<void>(`/admin/tag-groups/${groupId}/translations/${locale}`, {
        method: "DELETE",
    });
}
