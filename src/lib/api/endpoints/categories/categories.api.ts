import { query, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
    Category,
    CategoryNode,
    CategoryDetail,
    CreateCategoryDto,
    UpdateCategoryDto,
    CategoryTranslation,
} from "./categories.types";

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

/**
 * Fetch all translations for a category.
 */
export const getCategoryTranslations = query(async (categoryId: string) => {
    return apiClient<CategoryTranslation[]>(`/admin/categories/${categoryId}/translations`);
}, "category-translations");

/**
 * Upsert a category translation.
 */
export const upsertCategoryTranslation = async (categoryId: string, data: Partial<CategoryTranslation>) => {
    const result = await apiClient<CategoryTranslation>(`/admin/categories/${categoryId}/translations`, {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidate("category-translations");
    revalidate("category-detail");
    revalidate("category-tree");
    return result;
};

/**
 * Delete a category translation.
 */
export const deleteCategoryTranslation = async (categoryId: string, locale: string) => {
    const result = await apiClient(`/admin/categories/${categoryId}/translations/${locale}`, {
        method: "DELETE"
    });
    revalidate("category-translations");
    revalidate("category-detail");
    return result;
};
