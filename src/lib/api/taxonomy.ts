import { query, revalidate } from "@solidjs/router";
import { apiClient } from "./api-client";
import type { 
    Category,
    CategoryNode,
    CategoryDetail,
    CreateCategoryDto,
    UpdateCategoryDto,
    TagGroup,
    CreateTagGroupDto,
    UpdateTagGroupDto,
    TagGroupListParams,
    Tag,
    CreateTagDto,
    UpdateTagDto,
    TagListParams,
    PaginatedResponse
} from "./types";

// --- Categories ---

/**
 * Fetch the full hierarchical category tree.
 */
export const getCategoryTree = query(async () => {
    return apiClient<CategoryNode[]>("/admin/categories/tree");
}, "category-tree");

/**
 * Fetch detail for a single category.
 */
export const getCategoryDetail = query(async (id: string) => {
    return apiClient<CategoryDetail>(`/admin/categories/${id}`);
}, "category-detail");

/**
 * Create a new category.
 */
export const createCategory = async (data: CreateCategoryDto) => {
    const result = await apiClient<Category>("/admin/categories", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidate("category-tree");
    return result;
};

/**
 * Update an existing category.
 */
export const updateCategory = async (id: string, data: UpdateCategoryDto) => {
    const result = await apiClient<Category>(`/admin/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
    revalidate("category-tree");
    revalidate("category-detail");
    return result;
};

/**
 * Delete a category.
 */
export const deleteCategory = async (id: string) => {
    const result = await apiClient<Category>(`/admin/categories/${id}`, {
        method: "DELETE"
    });
    revalidate("category-tree");
    return result;
};

// --- Tag Groups ---

/**
 * Fetch tag groups (supports pagination, search, and filtering).
 */
export const getTagGroups = query(async (params?: TagGroupListParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
        if (params.search) searchParams.set("search", params.search);
        if (params.isActive) searchParams.set("isActive", params.isActive);
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
    }
    const qs = searchParams.toString();
    const url = qs ? `/admin/tag-groups?${qs}` : "/admin/tag-groups";
    
    // Note: The backend returns a paginated response wrapper
    const result = await apiClient<PaginatedResponse<TagGroup>>(url, { unwrapData: false } as any);
    return result.data as TagGroup[]; // Returning just the array for now to match UI expectation, but we have full paginated support if needed
}, "tag-groups");

/**
 * Fetch a single tag group with its nested tags.
 */
export const getTagGroupDetail = query(async (id: string) => {
    return apiClient<TagGroup>(`/admin/tag-groups/${id}`);
}, "tag-group-detail");

/**
 * Create a new tag group.
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
 * Update an existing tag group.
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
 * Delete a tag group.
 */
export const deleteTagGroup = async (id: string) => {
    const result = await apiClient<TagGroup>(`/admin/tag-groups/${id}`, {
        method: "DELETE"
    });
    revalidate("tag-groups");
    return result;
};

// --- Tags ---

/**
 * Fetch tags by group and search criteria.
 */
export const getTagsByGroup = query(async (params: TagListParams) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.isActive) searchParams.set("isActive", params.isActive);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    
    const qs = searchParams.toString();
    const url = qs ? `/admin/tag-groups/${params.groupId}/tags?${qs}` : `/admin/tag-groups/${params.groupId}/tags`;
    
    // Note: The backend returns a paginated response wrapper
    const result = await apiClient<any>(url, { unwrapData: false } as any);
    return (result.data as Tag[]) || [];
}, "tags-by-group");

/**
 * Create a new tag.
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
 * Update an existing tag.
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
 * Delete a tag.
 */
export const deleteTag = async (id: string) => {
    const result = await apiClient<Tag>(`/admin/tags/${id}`, {
        method: "DELETE"
    });
    revalidate("tag-groups");
    revalidate("tag-group-detail");
    return result;
};
