"use action";
import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  AdminShopSubscription,
  ExtendShopSubscriptionDto,
} from "./shop-subscription.types";

function revalidateShopSubscription(shopId: string) {
  revalidate(["shop-subscription", shopId]);
}

export const extendShopSubscription = action(
  async (shopId: string, data: ExtendShopSubscriptionDto) => {
    const result = await apiClient<AdminShopSubscription>(
      `/admin/shops/${shopId}/subscription/extend`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    revalidateShopSubscription(shopId);
    return result;
  },
  "extend-shop-subscription",
);
