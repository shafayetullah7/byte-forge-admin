import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { SubscriptionCoupon } from "./subscription-coupons.types";

export type ListSubscriptionCouponsParams = {
  search?: string;
  isActive?: boolean;
};

export const getSubscriptionCoupons = query(async (params?: ListSubscriptionCouponsParams) => {
  return apiClient<SubscriptionCoupon[]>("/admin/subscription/coupons", {
    params: {
      search: params?.search,
      isActive: params?.isActive,
    },
  });
}, "subscription-coupons-list");

export const getSubscriptionCoupon = query(async (id: string) => {
  return apiClient<SubscriptionCoupon>(`/admin/subscription/coupons/${id}`);
}, "subscription-coupon-detail");
