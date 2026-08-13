import { For } from "solid-js";
import { A } from "@solidjs/router";
import { Card } from "~/components/ui/Card";
import { ArrowTrendingUpIcon } from "~/components/icons";
import type { SubscriptionPlan } from "~/lib/api/endpoints/subscription-plans";
import { SUBSCRIPTION_PLAN_INTERVAL_LABELS } from "~/lib/api/endpoints/subscription-plans";
import { formatBdtPrice, formatPlanDate } from "./plan-formatters";
import { PlanStatusBadge, StripeSyncBadge } from "./PlanStatusBadges";

export function SubscriptionPlansTable(props: { plans: SubscriptionPlan[] }) {
  return (
    <Card class="overflow-hidden border-slate-200 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200">
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Plan
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Interval
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Stripe
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Updated
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <For
              each={props.plans}
              fallback={
                <tr>
                  <td colspan="6" class="px-6 py-16 text-center">
                    <div class="flex flex-col items-center">
                      <ArrowTrendingUpIcon class="w-10 h-10 text-slate-300 mb-3" />
                      <p class="text-sm font-semibold text-slate-500">No subscription plans found</p>
                      <p class="text-xs text-slate-400 mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              }
            >
              {(plan) => (
                <tr class="group hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <A
                      href={`/subscription/plans/${plan.id}`}
                      class="block text-slate-900 hover:text-primary-green-700 transition-colors"
                    >
                      <span class="font-semibold">{plan.name}</span>
                      <ShowDescription description={plan.description} />
                    </A>
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-slate-800">
                    {formatBdtPrice(plan.priceBdt)}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">
                    {SUBSCRIPTION_PLAN_INTERVAL_LABELS[plan.interval]}
                  </td>
                  <td class="px-6 py-4">
                    <StripeSyncBadge plan={plan} />
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">
                    {formatPlanDate(plan.updatedAt)}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <PlanStatusBadge plan={plan} />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <p class="text-sm text-slate-500">
          Showing <span class="font-medium text-slate-700">{props.plans.length}</span> plan
          {props.plans.length === 1 ? "" : "s"}
        </p>
      </div>
    </Card>
  );
}

function ShowDescription(props: { description: string | null }) {
  if (!props.description) return null;
  return <p class="text-xs text-slate-500 truncate max-w-xs mt-0.5">{props.description}</p>;
}
