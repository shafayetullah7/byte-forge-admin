import { For } from "solid-js";
import { Input } from "~/components/ui/Input";
import {
  SUBSCRIPTION_PLAN_INTERVALS,
  SUBSCRIPTION_PLAN_INTERVAL_LABELS,
  type SubscriptionPlanInterval,
} from "~/lib/api/endpoints/subscription-plans";

export interface SubscriptionPlanFormFieldsProps {
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
  errors: Record<string, string>;
  disabled?: boolean;
}

export function SubscriptionPlanFormFields(props: SubscriptionPlanFormFieldsProps) {
  return (
    <>
      <Input
        label="Plan Name"
        placeholder="e.g. Nursery Pro Monthly"
        value={props.name}
        onInput={(e) => props.onNameChange(e.currentTarget.value)}
        error={props.errors.name}
        disabled={props.disabled}
      />

      <div class="space-y-2">
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Description
        </label>
        <textarea
          class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 min-h-[80px] resize-y disabled:bg-slate-50 disabled:text-slate-400"
          placeholder="Short description for admins and sellers..."
          value={props.description}
          onInput={(e) => props.onDescriptionChange(e.currentTarget.value)}
          disabled={props.disabled}
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Billing interval
          </label>
          <select
            class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:bg-slate-50 disabled:text-slate-400"
            value={props.interval}
            disabled={props.disabled}
            onChange={(e) =>
              props.onIntervalChange(e.currentTarget.value as SubscriptionPlanInterval)
            }
          >
            <For each={SUBSCRIPTION_PLAN_INTERVALS}>
              {(value) => <option value={value}>{SUBSCRIPTION_PLAN_INTERVAL_LABELS[value]}</option>}
            </For>
          </select>
        </div>

        <Input
          label="Price (BDT)"
          placeholder="999.00"
          value={props.priceBdt}
          onInput={(e) => props.onPriceBdtChange(e.currentTarget.value)}
          error={props.errors.priceBdt}
          disabled={props.disabled}
        />
      </div>

      <Input
        label="Sort order"
        placeholder="0"
        value={props.sortOrder}
        onInput={(e) => props.onSortOrderChange(e.currentTarget.value)}
        error={props.errors.sortOrder}
        disabled={props.disabled}
      />
    </>
  );
}
