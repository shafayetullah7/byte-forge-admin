"use action";
import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  CreateSubscriptionPlanDto,
  SubscriptionPlan,
  UpdateSubscriptionPlanDto,
} from "./subscription-plans.types";

function revalidateSubscriptionPlans(id?: string) {
  revalidate("subscription-plans-list");
  if (id) {
    revalidate(["subscription-plan-detail", id]);
  } else {
    revalidate("subscription-plan-detail");
  }
}

export const createSubscriptionPlan = action(async (data: CreateSubscriptionPlanDto) => {
  const result = await apiClient<SubscriptionPlan>("/admin/subscription/plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidateSubscriptionPlans();
  return result;
}, "create-subscription-plan");

export const updateSubscriptionPlan = action(
  async (id: string, data: UpdateSubscriptionPlanDto) => {
    const result = await apiClient<SubscriptionPlan>(`/admin/subscription/plans/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidateSubscriptionPlans(id);
    return result;
  },
  "update-subscription-plan",
);

export const syncSubscriptionPlanToStripe = action(async (id: string) => {
  const result = await apiClient<SubscriptionPlan>(
    `/admin/subscription/plans/${id}/sync-stripe`,
    { method: "POST" },
  );
  revalidateSubscriptionPlans(id);
  return result;
}, "sync-subscription-plan-stripe");

export const retireSubscriptionPlan = action(async (id: string) => {
  const result = await apiClient<SubscriptionPlan>(
    `/admin/subscription/plans/${id}/retire`,
    { method: "PATCH" },
  );
  revalidateSubscriptionPlans(id);
  return result;
}, "retire-subscription-plan");
