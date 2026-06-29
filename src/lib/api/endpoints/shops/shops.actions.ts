"use action";

import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";

function revalidateShopCaches() {
  revalidate("shop-verification");
  revalidate("shop-detail");
  revalidate("shops-list");
  revalidate("shop-stats");
  revalidate("shop-history");
}

export const approveShop = action(async (id: string): Promise<void> => {
  await apiClient(`/admin/shops/${id}/approve`, { method: "POST" });
  revalidateShopCaches();
}, "approve-shop");

export const rejectShop = action(
  async (input: {
    id: string;
    reason: string;
    adminNotes?: string;
  }): Promise<void> => {
    await apiClient(`/admin/shops/${input.id}/reject`, {
      method: "POST",
      body: JSON.stringify({
        reason: input.reason,
        adminNotes: input.adminNotes,
      }),
    });
    revalidateShopCaches();
  },
  "reject-shop",
);

export const suspendShop = action(
  async (input: { id: string; reason: string }): Promise<void> => {
    await apiClient(`/admin/shops/${input.id}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason: input.reason }),
    });
    revalidateShopCaches();
  },
  "suspend-shop",
);

export const deactivateShop = action(
  async (input: { id: string; reason: string }): Promise<void> => {
    await apiClient(`/admin/shops/${input.id}/deactivate`, {
      method: "POST",
      body: JSON.stringify({ reason: input.reason }),
    });
    revalidateShopCaches();
  },
  "deactivate-shop",
);

export const reactivateShop = action(async (id: string): Promise<void> => {
  await apiClient(`/admin/shops/${id}/reactivate`, { method: "POST" });
  revalidateShopCaches();
}, "reactivate-shop");
