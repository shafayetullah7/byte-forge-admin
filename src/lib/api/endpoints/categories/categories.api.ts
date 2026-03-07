import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  Category,
  CategoryNode,
  CategoryDetail,
  CategoryTranslation,
} from "./categories.types";

/**
 * Fetch a flat list of categories (supports pagination, search, and filtering).
 */
export const getCategories = query(async (params?: { 
    search?: string; 
    isActive?: boolean; 
    page?: number; 
    limit?: number;
    sortBy?: string;
}) => {
    const searchParams = new URLSearchParams();
    if (params) {
        if (params.search) searchParams.set("search", params.search);
        if (params.isActive !== undefined) searchParams.set("isActive", params.isActive.toString());
        if (params.page) searchParams.set("page", params.page.toString());
        if (params.limit) searchParams.set("limit", params.limit.toString());
        if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    }
    const qs = searchParams.toString();
    const url = qs ? `/admin/categories?${qs}` : "/admin/categories";
    return apiClient<Category[]>(url); // Backend returns paginated list
}, "categories-list");

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
 * Fetch ancestors for a category (for breadcrumbs).
 */
export const getCategoryAncestors = query(async (id: string) => {
    return apiClient<Category[]> (`/admin/categories/${id}/ancestors`);
}, "category-ancestors");

/**
 * Fetch all translations for a category.
 */
export const getCategoryTranslations = query(async (categoryId: string) => {
    return apiClient<CategoryTranslation[]>(
        `/admin/categories/${categoryId}/translations`
    );
}, "category-translations");
