export type ShopSubscriptionStatus = "NONE" | "ACTIVE" | "EXPIRED";

export type ShopSubscriptionBillingProvider =
  | "NONE"
  | "COUPON"
  | "STRIPE"
  | "ADMIN"
  | "WALLET";

export interface ShopSubscriptionInvoiceSummary {
  id: string;
  amountBdt: string;
  currency: string;
  provider: string;
  status: string;
  receiptUrl: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminShopSubscription {
  shopId: string;
  status: ShopSubscriptionStatus;
  currentPeriodEnd: string | null;
  billingProvider: ShopSubscriptionBillingProvider;
  planId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  recentInvoices: ShopSubscriptionInvoiceSummary[];
}

export interface ExtendShopSubscriptionDto {
  days?: number;
  months?: number;
  reason: string;
}

export const SHOP_SUBSCRIPTION_STATUS_LABELS: Record<ShopSubscriptionStatus, string> = {
  NONE: "No subscription",
  ACTIVE: "Active",
  EXPIRED: "Expired",
};

export const SHOP_SUBSCRIPTION_PROVIDER_LABELS: Record<
  ShopSubscriptionBillingProvider,
  string
> = {
  NONE: "None",
  COUPON: "Coupon",
  STRIPE: "Stripe",
  ADMIN: "Admin extension",
  WALLET: "Wallet",
};
