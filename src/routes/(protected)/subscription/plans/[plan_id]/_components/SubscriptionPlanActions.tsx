import { Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import type { SubscriptionPlan } from "~/lib/api/endpoints/subscription-plans";

export interface SubscriptionPlanActionsProps {
  plan: SubscriptionPlan;
  confirmMode: "retire" | null;
  onConfirmModeChange: (mode: "retire" | null) => void;
  syncLoading: boolean;
  retireLoading: boolean;
  syncError: string | null;
  retireError: string | null;
  onSyncStripe: () => void;
  onRetire: () => void;
}

export function SubscriptionPlanActions(props: SubscriptionPlanActionsProps) {
  return (
    <div class="space-y-4">
      <Card class="p-6 border-slate-200">
        <h2 class="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
          Stripe sync
        </h2>
        <p class="text-sm text-slate-600 mb-4">
          Creates or updates the Stripe Product and recurring Price for seller checkout.
        </p>
        <Show when={props.syncError}>
          <p class="text-xs text-red-600 mb-3">{props.syncError}</p>
        </Show>
        <Button
          variant="primary"
          class="w-full"
          isLoading={props.syncLoading}
          disabled={props.plan.isRetired}
          onClick={props.onSyncStripe}
        >
          {props.plan.stripePriceId ? "Re-sync to Stripe" : "Sync to Stripe"}
        </Button>
        <Show when={props.plan.isRetired}>
          <p class="text-xs text-slate-500 mt-3">Retired plans cannot be synced.</p>
        </Show>
      </Card>

      <Card class="p-6 border-slate-200">
        <h2 class="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
          Retire plan
        </h2>
        <p class="text-sm text-slate-600 mb-4">
          Stops new purchases while grandfathering existing Stripe subscribers.
        </p>

        <Show when={props.plan.isRetired}>
          <p class="text-sm font-medium text-slate-700">This plan is already retired.</p>
        </Show>

        <Show when={!props.plan.isRetired}>
          <Show
            when={props.confirmMode === "retire"}
            fallback={
              <Button
                variant="danger"
                class="w-full"
                onClick={() => props.onConfirmModeChange("retire")}
              >
                Retire plan
              </Button>
            }
          >
            <div class="space-y-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <p class="text-sm text-slate-700">
                Retire <strong>{props.plan.name}</strong>? Sellers will no longer be able to start
                new subscriptions on this plan.
              </p>
              <Show when={props.retireError}>
                <p class="text-xs text-red-600">{props.retireError}</p>
              </Show>
              <div class="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  class="flex-1"
                  onClick={() => props.onConfirmModeChange(null)}
                  disabled={props.retireLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  class="flex-1"
                  isLoading={props.retireLoading}
                  onClick={props.onRetire}
                >
                  Confirm retire
                </Button>
              </div>
            </div>
          </Show>
        </Show>
      </Card>
    </div>
  );
}
