"use action";
import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  CreateSubscriptionCouponDto,
  SubscriptionCoupon,
  UpdateSubscriptionCouponDto,
} from "./subscription-coupons.types";

function revalidateSubscriptionCoupons(id?: string) {
  revalidate("subscription-coupons-list");
  if (id) {
    revalidate(["subscription-coupon-detail", id]);
  } else {
    revalidate("subscription-coupon-detail");
  }
}

export const createSubscriptionCoupon = action(async (data: CreateSubscriptionCouponDto) => {
  const result = await apiClient<SubscriptionCoupon>("/admin/subscription/coupons", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidateSubscriptionCoupons();
  return result;
}, "create-subscription-coupon");

export const updateSubscriptionCoupon = action(
  async (id: string, data: UpdateSubscriptionCouponDto) => {
    const result = await apiClient<SubscriptionCoupon>(`/admin/subscription/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidateSubscriptionCoupons(id);
    return result;
  },
  "update-subscription-coupon",
);

export const deactivateSubscriptionCoupon = action(async (id: string) => {
  const result = await apiClient<SubscriptionCoupon>(
    `/admin/subscription/coupons/${id}/deactivate`,
    { method: "PATCH" },
  );
  revalidateSubscriptionCoupons(id);
  return result;
}, "deactivate-subscription-coupon");
