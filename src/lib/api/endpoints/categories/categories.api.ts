import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  CategoryNode,
  CategoryDetail,
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
 * Fetch all translations for a category.
 */
export const getCategoryTranslations = query(async (categoryId: string) => {
  return apiClient<CategoryTranslation[]>(
    `/admin/categories/${categoryId}/translations`
  );
}, "category-translations");
