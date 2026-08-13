import { Show } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import type { AdminShopSubscription } from "~/lib/api/endpoints/shop-subscription";
import {
  SHOP_SUBSCRIPTION_PROVIDER_LABELS,
  SHOP_SUBSCRIPTION_STATUS_LABELS,
} from "~/lib/api/endpoints/shop-subscription";
import { formatSubscriptionDate } from "./subscription-formatters";

const statusVariant: Record<
  AdminShopSubscription["status"],
  "success" | "secondary" | "danger"
> = {
  ACTIVE: "success",
  NONE: "secondary",
  EXPIRED: "danger",
};

export function SubscriptionStatusCard(props: { subscription: AdminShopSubscription }) {
  return (
    <Card class="p-6 border-slate-200">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Subscription status</h2>
          <p class="text-sm text-slate-500 mt-1">
            Seller platform billing entitlement for this shop.
          </p>
        </div>
        <Badge variant={statusVariant[props.subscription.status]} size="md">
          {SHOP_SUBSCRIPTION_STATUS_LABELS[props.subscription.status]}
        </Badge>
      </div>

      <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <dt class="text-slate-500">Active until</dt>
          <dd class="text-slate-900 font-semibold mt-1">
            {formatSubscriptionDate(props.subscription.currentPeriodEnd)}
          </dd>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <dt class="text-slate-500">Billing provider</dt>
          <dd class="text-slate-900 font-semibold mt-1">
            {SHOP_SUBSCRIPTION_PROVIDER_LABELS[props.subscription.billingProvider]}
          </dd>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <dt class="text-slate-500">Plan ID</dt>
          <dd class="text-slate-900 font-mono text-xs mt-1 break-all">
            {props.subscription.planId ?? "—"}
          </dd>
        </div>
      </dl>

      <Show when={props.subscription.stripeSubscriptionId || props.subscription.cancelAtPeriodEnd}>
        <div class="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
          <Show when={props.subscription.stripeSubscriptionId}>
            <p class="text-slate-500">
              Stripe subscription:{" "}
              <span class="font-mono text-xs text-slate-700 break-all">
                {props.subscription.stripeSubscriptionId}
              </span>
            </p>
          </Show>
          <Show when={props.subscription.cancelAtPeriodEnd}>
            <p class="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs">
              Stripe subscription is set to cancel at period end.
            </p>
          </Show>
        </div>
      </Show>
    </Card>
  );
}
