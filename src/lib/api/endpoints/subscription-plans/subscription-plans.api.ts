import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { SubscriptionPlan } from "./subscription-plans.types";

export type ListSubscriptionPlansParams = {
  search?: string;
  includeRetired?: boolean;
  activeForNewOnly?: boolean;
};

export const getSubscriptionPlans = query(async (params?: ListSubscriptionPlansParams) => {
  return apiClient<SubscriptionPlan[]>("/admin/subscription/plans", {
    params: {
      search: params?.search,
      includeRetired: params?.includeRetired,
      activeForNewOnly: params?.activeForNewOnly,
    },
  });
}, "subscription-plans-list");

export const getSubscriptionPlan = query(async (id: string) => {
  return apiClient<SubscriptionPlan>(`/admin/subscription/plans/${id}`);
}, "subscription-plan-detail");
