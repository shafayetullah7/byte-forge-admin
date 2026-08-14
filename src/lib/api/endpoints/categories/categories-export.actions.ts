import { apiClient } from "../../api-client";
import type { BulkImportCategoryInput } from "./categories-bulk-import.types";

export interface CategoryExportPayload {
  items: BulkImportCategoryInput[];
}

export async function fetchCategoriesForExport(): Promise<CategoryExportPayload> {
  return apiClient<CategoryExportPayload>("/admin/categories/export");
}

export function downloadCategoryExportJson(payload: CategoryExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `categories-export-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
