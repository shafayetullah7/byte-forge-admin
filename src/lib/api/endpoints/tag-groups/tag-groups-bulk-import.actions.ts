"use action";

import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  BulkImportTagGroupsPayload,
  BulkImportTagGroupsResult,
} from "./tag-groups-bulk-import.types";

export const bulkImportTagGroups = action(
  async (payload: BulkImportTagGroupsPayload) => {
    const result = await apiClient<BulkImportTagGroupsResult>(
      "/admin/tag-groups/bulk-import",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    if (!payload.options.dryRun) {
      revalidate("tag-groups");
    }
    return result;
  },
  "bulk-import-tag-groups",
);
