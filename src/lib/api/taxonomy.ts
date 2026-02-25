import { query, action, revalidate } from "@solidjs/router";
import { apiClient } from "./api-client";

// --- Categories ---

/**
 * Fetch the full hierarchical category tree.
 */
export const getCategoryTree = query(async () => {
    return apiClient<any[]>("/admin/categories/tree");
}, "category-tree");

/**
 * Fetch detail for a single category.
 */
export const getCategoryDetail = query(async (id: string) => {
    return apiClient<any>(`/admin/categories/${id}`);
}, "category-detail");

/**
 * Create a new category.
 */
export const createCategory = action(async (data: any) => {
    const result = await apiClient<any>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidate("category-tree");
    return result;
});

/**
 * Update an existing category.
 */
export const updateCategory = action(async ({ id, ...data }: any) => {
    const result = await apiClient<any>(`/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
    revalidate("category-tree");
    revalidate("category-detail");
    return result;
});

/**
 * Delete a category.
 */
export const deleteCategory = action(async (id: string) => {
    const result = await apiClient<any>(`/admin/categories/${id}`, {
        method: "DELETE"
    });
    revalidate("category-tree");
    return result;
});

// --- Tag Groups ---

/**
 * Fetch all tag groups for the library dashboard.
 */
export const getTagGroups = query(async () => {
    return apiClient<any[]>("/admin/tag-groups");
}, "tag-groups");

/**
 * Fetch a single tag group with its nested tags.
 */
export const getTagGroupDetail = query(async (id: string) => {
    return apiClient<any>(`/admin/tag-groups/${id}`);
}, "tag-group-detail");

/**
 * Create a new tag group.
 */
export const createTagGroup = action(async (data: any) => {
    const result = await apiClient<any>("/admin/tag-groups", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    return result;
});

/**
 * Update an existing tag group.
 */
export const updateTagGroup = action(async ({ id, ...data }: any) => {
    const result = await apiClient<any>(`/admin/tag-groups/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    revalidate("tag-group-detail");
    return result;
});

/**
 * Delete a tag group.
 */
export const deleteTagGroup = action(async (id: string) => {
    const result = await apiClient<any>(`/admin/tag-groups/${id}`, {
        method: "DELETE"
    });
    revalidate("tag-groups");
    return result;
});

// --- Tags ---

/**
 * Create a new tag.
 */
export const createTag = action(async (data: any) => {
    const result = await apiClient<any>("/admin/tags", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    if (result.groupId) revalidate(["tag-group-detail", result.groupId]);
    return result;
});

/**
 * Update an existing tag.
 */
export const updateTag = action(async ({ id, ...data }: any) => {
    const result = await apiClient<any>(`/admin/tags/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
    revalidate("tag-groups");
    return result;
});

/**
 * Delete a tag.
 */
export const deleteTag = action(async (id: string) => {
    const result = await apiClient<any>(`/admin/tags/${id}`, {
        method: "DELETE"
    });
    revalidate("tag-groups");
    revalidate("tag-group-detail");
    return result;
});
