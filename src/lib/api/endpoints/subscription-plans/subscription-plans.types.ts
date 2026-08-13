export type SubscriptionPlanInterval = "MONTH" | "YEAR";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  interval: SubscriptionPlanInterval;
  priceBdt: string;
  isActiveForNew: boolean;
  isRetired: boolean;
  stripeProductId: string | null;
  stripePriceId: string | null;
  previousStripePriceIds: string[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPlanDto {
  name: string;
  description?: string | null;
  interval: SubscriptionPlanInterval;
  priceBdt: string;
  sortOrder?: number;
}

export interface UpdateSubscriptionPlanDto {
  name?: string;
  description?: string | null;
  interval?: SubscriptionPlanInterval;
  priceBdt?: string;
  isActiveForNew?: boolean;
  sortOrder?: number;
}

export const SUBSCRIPTION_PLAN_INTERVALS: SubscriptionPlanInterval[] = ["MONTH", "YEAR"];

export const SUBSCRIPTION_PLAN_INTERVAL_LABELS: Record<SubscriptionPlanInterval, string> = {
  MONTH: "Monthly",
  YEAR: "Yearly",
};
