import { Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import type { SubscriptionCoupon } from "~/lib/api/endpoints/subscription-coupons";
import { SubscriptionCouponFormFields } from "../../_components/SubscriptionCouponFormFields";
import type { SubscriptionCouponDurationUnit } from "~/lib/api/endpoints/subscription-coupons";

export interface SubscriptionCouponEditFormProps {
  coupon: SubscriptionCoupon;
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
  saveError: string | null;
  saving: boolean;
  onSubmit: (e: Event) => void;
  onBack: () => void;
}

export function SubscriptionCouponEditForm(props: SubscriptionCouponEditFormProps) {
  const disabled = () => !props.coupon.isActive;

  return (
    <Card class="p-6">
      <h2 class="text-base font-bold text-slate-900 mb-6">Edit coupon</h2>
      <Show when={!props.coupon.isActive}>
        <div class="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
          This coupon is inactive. Reactivate it from the sidebar to allow edits and redemptions.
        </div>
      </Show>
      <form onSubmit={props.onSubmit} class="space-y-4">
        <Show when={props.saveError}>
          <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {props.saveError}
          </div>
        </Show>

        <SubscriptionCouponFormFields
          code={props.code}
          onCodeChange={props.onCodeChange}
          durationValue={props.durationValue}
          onDurationValueChange={props.onDurationValueChange}
          durationUnit={props.durationUnit}
          onDurationUnitChange={props.onDurationUnitChange}
          maxRedemptions={props.maxRedemptions}
          onMaxRedemptionsChange={props.onMaxRedemptionsChange}
          validFrom={props.validFrom}
          onValidFromChange={props.onValidFromChange}
          validUntil={props.validUntil}
          onValidUntilChange={props.onValidUntilChange}
          errors={props.errors}
          disabled={disabled()}
        />

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
