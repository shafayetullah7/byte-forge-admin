"use action";

import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  BulkImportCategoriesPayload,
  BulkImportCategoriesResult,
} from "./categories-bulk-import.types";

export const bulkImportCategories = action(
  async (payload: BulkImportCategoriesPayload) => {
    const result = await apiClient<BulkImportCategoriesResult>(
      "/admin/categories/bulk-import",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    if (!payload.options.dryRun) {
      revalidate("category-tree");
    }
    return result;
  },
  "bulk-import-categories",
);
