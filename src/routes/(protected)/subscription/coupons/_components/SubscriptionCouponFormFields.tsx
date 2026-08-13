import { For } from "solid-js";
import { Input } from "~/components/ui/Input";
import {
  SUBSCRIPTION_COUPON_DURATION_UNITS,
  SUBSCRIPTION_COUPON_DURATION_UNIT_LABELS,
  type SubscriptionCouponDurationUnit,
} from "~/lib/api/endpoints/subscription-coupons";

export interface SubscriptionCouponFormFieldsProps {
  code: string;
  onCodeChange: (value: string) => void;
  durationValue: string;
  onDurationValueChange: (value: string) => void;
  durationUnit: SubscriptionCouponDurationUnit;
  onDurationUnitChange: (value: SubscriptionCouponDurationUnit) => void;
  maxRedemptions: string;
  onMaxRedemptionsChange: (value: string) => void;
  validFrom: string;
  onValidFromChange: (value: string) => void;
  validUntil: string;
  onValidUntilChange: (value: string) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

export function SubscriptionCouponFormFields(props: SubscriptionCouponFormFieldsProps) {
  return (
    <>
      <Input
        label="Coupon code"
        placeholder="e.g. FOUNDING2026"
        value={props.code}
        onInput={(e) => props.onCodeChange(e.currentTarget.value.toUpperCase())}
        error={props.errors.code}
        disabled={props.disabled}
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Duration value"
          placeholder="3"
          value={props.durationValue}
          onInput={(e) => props.onDurationValueChange(e.currentTarget.value)}
          error={props.errors.durationValue}
          disabled={props.disabled}
        />

        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Duration unit
          </label>
          <select
            class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:bg-slate-50 disabled:text-slate-400"
            value={props.durationUnit}
            disabled={props.disabled}
            onChange={(e) =>
              props.onDurationUnitChange(e.currentTarget.value as SubscriptionCouponDurationUnit)
            }
          >
            <For each={SUBSCRIPTION_COUPON_DURATION_UNITS}>
              {(value) => (
                <option value={value}>{SUBSCRIPTION_COUPON_DURATION_UNIT_LABELS[value]}</option>
              )}
            </For>
          </select>
        </div>
      </div>

      <Input
        label="Max redemptions"
        placeholder="Leave empty for unlimited"
        value={props.maxRedemptions}
        onInput={(e) => props.onMaxRedemptionsChange(e.currentTarget.value)}
        error={props.errors.maxRedemptions}
        disabled={props.disabled}
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Valid from
          </label>
          <input
            type="datetime-local"
            class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:bg-slate-50 disabled:text-slate-400"
            value={props.validFrom}
            disabled={props.disabled}
            onInput={(e) => props.onValidFromChange(e.currentTarget.value)}
          />
          <ShowFieldError message={props.errors.validFrom} />
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Valid until
          </label>
          <input
            type="datetime-local"
            class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:bg-slate-50 disabled:text-slate-400"
            value={props.validUntil}
            disabled={props.disabled}
            onInput={(e) => props.onValidUntilChange(e.currentTarget.value)}
          />
          <ShowFieldError message={props.errors.validUntil} />
        </div>
      </div>
    </>
  );
}

function ShowFieldError(props: { message?: string }) {
  if (!props.message) return null;
  return <p class="text-xs text-red-600">{props.message}</p>;
}
