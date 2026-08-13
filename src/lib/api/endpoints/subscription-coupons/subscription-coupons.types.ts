export type SubscriptionCouponDurationUnit = "DAY" | "MONTH";

export interface SubscriptionCoupon {
  id: string;
  code: string;
  durationValue: number;
  durationUnit: SubscriptionCouponDurationUnit;
  maxRedemptions: number | null;
  redemptionCount: number;
  redemptionsRemaining: number | null;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionCouponDto {
  code: string;
  durationValue: number;
  durationUnit: SubscriptionCouponDurationUnit;
  maxRedemptions?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
}

export interface UpdateSubscriptionCouponDto {
  code?: string;
  durationValue?: number;
  durationUnit?: SubscriptionCouponDurationUnit;
  maxRedemptions?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
  isActive?: boolean;
}

export const SUBSCRIPTION_COUPON_DURATION_UNITS: SubscriptionCouponDurationUnit[] = [
  "DAY",
  "MONTH",
];

export const SUBSCRIPTION_COUPON_DURATION_UNIT_LABELS: Record<
  SubscriptionCouponDurationUnit,
  string
> = {
  DAY: "Days",
  MONTH: "Months",
};
