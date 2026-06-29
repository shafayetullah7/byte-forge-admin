"use action";

import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";

function revalidateProductCaches(productId?: string) {
  revalidate("admin-products");
  if (productId) {
    revalidate(["admin-product-detail", productId]);
  } else {
    revalidate("admin-product-detail");
  }
}

export const archiveAdminProduct = action(
  async (input: { productId: string; reason?: string }): Promise<void> => {
    await apiClient(`/admin/products/${input.productId}/archive`, {
      method: "PATCH",
      body: JSON.stringify({ reason: input.reason }),
    });
    revalidateProductCaches(input.productId);
  },
  "archive-admin-product",
);

export const restoreAdminProduct = action(async (productId: string): Promise<void> => {
  await apiClient(`/admin/products/${productId}/restore`, {
    method: "PATCH",
  });
  revalidateProductCaches(productId);
}, "restore-admin-product");
