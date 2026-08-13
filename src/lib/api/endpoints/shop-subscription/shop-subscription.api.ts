import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { AdminShopSubscription } from "./shop-subscription.types";

export const getShopSubscription = query(async (shopId: string) => {
  return apiClient<AdminShopSubscription>(`/admin/shops/${shopId}/subscription`);
}, "shop-subscription");
