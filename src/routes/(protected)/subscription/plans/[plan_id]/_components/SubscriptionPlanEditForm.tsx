import { Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import type { SubscriptionPlan } from "~/lib/api/endpoints/subscription-plans";
import type { SubscriptionPlanInterval } from "~/lib/api/endpoints/subscription-plans";
import { SubscriptionPlanFormFields } from "../../_components/SubscriptionPlanFormFields";

export interface SubscriptionPlanEditFormProps {
  plan: SubscriptionPlan;
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  interval: SubscriptionPlanInterval;
  onIntervalChange: (value: SubscriptionPlanInterval) => void;
  priceBdt: string;
  onPriceBdtChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  isActiveForNew: boolean;
  onIsActiveForNewChange: (value: boolean) => void;
  errors: Record<string, string>;
  saveError: string | null;
  saving: boolean;
  onSubmit: (e: Event) => void;
  onBack: () => void;
}

export function SubscriptionPlanEditForm(props: SubscriptionPlanEditFormProps) {
  const disabled = () => props.plan.isRetired;

  return (
    <Card class="p-6">
      <h2 class="text-base font-bold text-slate-900 mb-6">Edit plan</h2>
      <Show when={props.plan.isRetired}>
        <div class="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
          This plan is retired. Existing subscribers are grandfathered; edits are limited to
          metadata only.
        </div>
      </Show>
      <form onSubmit={props.onSubmit} class="space-y-4">
        <Show when={props.saveError}>
          <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {props.saveError}
          </div>
        </Show>

        <SubscriptionPlanFormFields
          name={props.name}
          onNameChange={props.onNameChange}
          description={props.description}
          onDescriptionChange={props.onDescriptionChange}
          interval={props.interval}
          onIntervalChange={props.onIntervalChange}
          priceBdt={props.priceBdt}
          onPriceBdtChange={props.onPriceBdtChange}
          sortOrder={props.sortOrder}
          onSortOrderChange={props.onSortOrderChange}
          errors={props.errors}
          disabled={disabled()}
        />

        <label class="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
          <input
            type="checkbox"
            class="mt-1 rounded border-slate-300 text-primary-green-600 focus:ring-primary-green-500"
            checked={props.isActiveForNew}
            disabled={disabled()}
            onChange={(e) => props.onIsActiveForNewChange(e.currentTarget.checked)}
          />
          <span>
            <span class="block text-sm font-semibold text-slate-800">Active for new purchases</span>
            <span class="block text-xs text-slate-500 mt-0.5">
              When off, the plan is hidden from seller checkout but existing subscriptions continue.
            </span>
          </span>
        </label>

        <Show when={!disabled()}>
          <p class="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Changing price or interval requires re-syncing to Stripe. A new Stripe Price will be
            created and the old one deactivated for grandfathering.
          </p>
        </Show>

        <div class="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={props.onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" isLoading={props.saving} disabled={disabled()}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
