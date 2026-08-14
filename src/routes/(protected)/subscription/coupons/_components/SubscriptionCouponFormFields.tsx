import { createMemo, For, Show } from "solid-js";
import { Input } from "~/components/ui/Input";
import {
  SUBSCRIPTION_COUPON_DURATION_UNITS,
  SUBSCRIPTION_COUPON_DURATION_UNIT_LABELS,
  type SubscriptionCouponDurationUnit,
} from "~/lib/api/endpoints/subscription-coupons";
import { previewCouponAccessGrant } from "./coupon-formatters";

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
  const accessPreview = createMemo(() =>
    previewCouponAccessGrant(props.durationValue, props.durationUnit),
  );

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

      <section class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
        <div>
          <h3 class="text-sm font-semibold text-slate-900">Subscription access on redeem</h3>
          <p class="text-sm text-slate-600 mt-1">
            Free subscription time added to the shop when a seller redeems this code. This is not a
            Stripe discount and does not change plan prices.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Length"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 3"
            value={props.durationValue}
            onInput={(e) => props.onDurationValueChange(e.currentTarget.value)}
            error={props.errors.durationValue}
            disabled={props.disabled}
          />

          <div class="space-y-2">
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Unit
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
            <p class="text-xs text-slate-500">Choose days or months for the length above.</p>
          </div>
        </div>

        <div
          class="rounded-lg border border-primary-green-200 bg-primary-green-50/80 px-3 py-2.5 text-sm text-slate-800"
          role="status"
          aria-live="polite"
        >
          <span class="font-medium text-primary-green-900">Preview: </span>
          {accessPreview()}
        </div>

        <p class="text-xs text-slate-500">
          Examples: length <strong>90</strong> + unit <strong>Days</strong> = 90 days; length{" "}
          <strong>6</strong> + unit <strong>Months</strong> = six calendar months.
        </p>
      </section>

      <Input
        label="Max redemptions"
        placeholder="Leave empty for unlimited"
        value={props.maxRedemptions}
        onInput={(e) => props.onMaxRedemptionsChange(e.currentTarget.value)}
        error={props.errors.maxRedemptions}
        disabled={props.disabled}
      />

      <section class="space-y-3">
        <div>
          <h3 class="text-sm font-semibold text-slate-900">When sellers can use this code</h3>
          <p class="text-sm text-slate-600 mt-1">
            Optional window for redemptions. Leave blank to allow use anytime (while the coupon is
            active).
          </p>
        </div>

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
            <p class="text-xs text-slate-500">Earliest redemption time. Optional.</p>
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
            <p class="text-xs text-slate-500">Last redemption time. Optional.</p>
            <ShowFieldError message={props.errors.validUntil} />
          </div>
        </div>
      </section>
    </>
  );
}

function ShowFieldError(props: { message?: string }) {
  if (!props.message) return null;
  return <p class="text-xs text-red-600">{props.message}</p>;
}
