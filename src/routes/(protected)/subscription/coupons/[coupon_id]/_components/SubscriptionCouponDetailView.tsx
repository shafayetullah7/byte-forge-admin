import { createSignal, createEffect, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import type { SubscriptionCoupon } from "~/lib/api/endpoints/subscription-coupons";
import { SubscriptionCouponSummaryCard } from "./SubscriptionCouponSummaryCard";
import { SubscriptionCouponEditForm } from "./SubscriptionCouponEditForm";
import { SubscriptionCouponActions } from "./SubscriptionCouponActions";
import { useSubscriptionCouponDetailActions } from "./useSubscriptionCouponDetailActions";

export function SubscriptionCouponDetailView(props: { coupon: SubscriptionCoupon }) {
  const navigate = useNavigate();
  const coupon = () => props.coupon;
  const actions = useSubscriptionCouponDetailActions(coupon);
  const [lastSyncedAt, setLastSyncedAt] = createSignal<string | null>(null);

  createEffect(() => {
    const data = props.coupon;
    if (lastSyncedAt() === data.updatedAt) return;
    setLastSyncedAt(data.updatedAt);
    actions.resetForm(data);
  });

  return (
    <>
      <Show when={actions.toast()}>
        <div class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl bg-primary-green-800 text-white text-sm font-medium shadow-lg border border-primary-green-700">
          {actions.toast()}
        </div>
      </Show>

      <nav class="flex mb-6 text-sm font-medium text-slate-500">
        <A href="/subscription/coupons" class="hover:text-primary-green-700 transition-colors">
          Subscription Coupons
        </A>
        <span class="mx-2 text-slate-300">/</span>
        <span class="text-slate-900 font-semibold font-mono">{props.coupon.code}</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8 items-start">
        <div class="flex-1 space-y-6 w-full">
          <SubscriptionCouponSummaryCard coupon={props.coupon} />
          <SubscriptionCouponEditForm
            coupon={props.coupon}
            code={actions.code()}
            onCodeChange={actions.setCode}
            durationValue={actions.durationValue()}
            onDurationValueChange={actions.setDurationValue}
            durationUnit={actions.durationUnit()}
            onDurationUnitChange={actions.setDurationUnit}
            maxRedemptions={actions.maxRedemptions()}
            onMaxRedemptionsChange={actions.setMaxRedemptions}
            validFrom={actions.validFrom()}
            onValidFromChange={actions.setValidFrom}
            validUntil={actions.validUntil()}
            onValidUntilChange={actions.setValidUntil}
            errors={actions.errors()}
            saveError={actions.saveError()}
            saving={actions.saving()}
            onSubmit={actions.handleSave}
            onBack={() => navigate("/subscription/coupons")}
          />
        </div>

        <div class="w-full lg:w-80">
          <SubscriptionCouponActions
            coupon={props.coupon}
            confirmMode={actions.confirmMode()}
            onConfirmModeChange={(mode) => {
              actions.setActionError(null);
              actions.setConfirmMode(mode);
            }}
            actionLoading={actions.actionLoading()}
            actionError={actions.actionError()}
            onDeactivate={actions.handleDeactivate}
            onReactivate={actions.handleReactivate}
          />
        </div>
      </div>
    </>
  );
}
