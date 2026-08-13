import { Show } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import type { SubscriptionPlan } from "~/lib/api/endpoints/subscription-plans";
import { SUBSCRIPTION_PLAN_INTERVAL_LABELS } from "~/lib/api/endpoints/subscription-plans";
import { formatBdtPrice, formatPlanDate } from "../../_components/plan-formatters";
import { PlanStatusBadge, StripeSyncBadge } from "../../_components/PlanStatusBadges";

export function SubscriptionPlanSummaryCard(props: { plan: SubscriptionPlan }) {
  return (
    <Card class="p-6">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">{props.plan.name}</h1>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" size="sm">
              {SUBSCRIPTION_PLAN_INTERVAL_LABELS[props.plan.interval]}
            </Badge>
            <span class="text-lg font-bold text-slate-800">{formatBdtPrice(props.plan.priceBdt)}</span>
            <PlanStatusBadge plan={props.plan} />
            <StripeSyncBadge plan={props.plan} />
          </div>
        </div>
        <p class="text-sm text-slate-500">
          Sort order: <span class="font-semibold text-slate-700">{props.plan.sortOrder}</span>
        </p>
      </div>

      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <dt class="text-slate-500">Created</dt>
          <dd class="text-slate-800 font-medium">{formatPlanDate(props.plan.createdAt)}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Last updated</dt>
          <dd class="text-slate-800 font-medium">{formatPlanDate(props.plan.updatedAt)}</dd>
        </div>
      </dl>

      <Show when={props.plan.description}>
        <div class="pt-4 mt-4 border-t border-slate-100">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Description
          </p>
          <p class="text-sm text-slate-700">{props.plan.description}</p>
        </div>
      </Show>

      <Show when={props.plan.stripeProductId || props.plan.stripePriceId}>
        <div class="pt-4 mt-4 border-t border-slate-100 space-y-2">
          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stripe IDs</p>
          <Show when={props.plan.stripeProductId}>
            <p class="text-xs font-mono text-slate-600 break-all">
              Product: {props.plan.stripeProductId}
            </p>
          </Show>
          <Show when={props.plan.stripePriceId}>
            <p class="text-xs font-mono text-slate-600 break-all">
              Price: {props.plan.stripePriceId}
            </p>
          </Show>
          <Show when={props.plan.previousStripePriceIds.length > 0}>
            <p class="text-xs text-slate-500">
              Previous prices: {props.plan.previousStripePriceIds.length} (grandfathered)
            </p>
          </Show>
        </div>
      </Show>
    </Card>
  );
}
