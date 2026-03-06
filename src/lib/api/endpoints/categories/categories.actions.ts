import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryTranslation,
} from "./categories.types";

/**
 * Create a new category.
 */
export const createCategory = action(async (data: CreateCategoryDto) => {
  const result = await apiClient<Category>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidate("category-tree");
  return result;
}, "create-category");

/**
 * Update an existing category.
 */
export const updateCategory = action(
  async (id: string, data: UpdateCategoryDto) => {
    const result = await apiClient<Category>(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidate("category-tree");
    revalidate("category-detail");
    return result;
  },
  "update-category"
);

/**
 * Delete a category.
 */
export const deleteCategory = action(async (id: string) => {
  const result = await apiClient<Category>(`/admin/categories/${id}`, {
    method: "DELETE",
  });
  revalidate("category-tree");
  return result;
}, "delete-category");

/**
 * Upsert a category translation.
 */
export const upsertCategoryTranslation = action(
  async (categoryId: string, data: Partial<CategoryTranslation>) => {
    const result = await apiClient<CategoryTranslation>(
      `/admin/categories/${categoryId}/translations`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    revalidate("category-translations");
    revalidate("category-detail");
    revalidate("category-tree");
    return result;
  },
  "upsert-category-translation"
);

/**
 * Delete a category translation.
 */
export const deleteCategoryTranslation = action(
  async (categoryId: string, locale: string) => {
    const result = await apiClient(
      `/admin/categories/${categoryId}/translations/${locale}`,
      {
        method: "DELETE",
      }
    );
    revalidate("category-translations");
    revalidate("category-detail");
    revalidate("category-tree");
    return result;
  },
  "delete-category-translation"
);
