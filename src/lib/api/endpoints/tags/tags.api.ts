import { query, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
    Tag,
    TagListParams,
    CreateTagDto,
    UpdateTagDto,
} from "./tags.types";

/**
 * Fetch all tags within a specific tag group, scoped by groupId.
 * Endpoint: GET /admin/tag-groups/:groupId/tags
 */
export const getTagsByGroup = query(async (params: TagListParams) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.isActive) searchParams.set("isActive", params.isActive);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    const qs = searchParams.toString();
    const url = qs
        ? `/admin/tag-groups/${params.groupId}/tags?${qs}`
        : `/admin/tag-groups/${params.groupId}/tags`;

    const result = await apiClient<any>(url, { unwrapData: false } as any);
    return (result.data as Tag[]) || [];
}, "tags-by-group");

/**
 * Create a new tag strictly within a group.
 * Endpoint: POST /admin/tag-groups/:groupId/tags
 */
export const createTag = async (groupId: string, data: CreateTagDto) => {
    const result = await apiClient<Tag>(`/admin/tag-groups/${groupId}/tags`, {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    revalidate(["tag-group-detail", groupId]);
    return result;
};

/**
 * Update an existing tag's slug, active status, or reparent to another group.
 * Endpoint: PATCH /admin/tags/:id
 */
export const updateTag = async (id: string, data: UpdateTagDto) => {
    const result = await apiClient<Tag>(`/admin/tags/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    return result;
};

/**
 * Soft-delete a tag.
 * Endpoint: DELETE /admin/tags/:id
 */
export const deleteTag = async (id: string) => {
    const result = await apiClient<Tag>(`/admin/tags/${id}`, {
        method: "DELETE"
    });
    revalidate("tag-groups");
    revalidate("tag-group-detail");
    return result;
};
