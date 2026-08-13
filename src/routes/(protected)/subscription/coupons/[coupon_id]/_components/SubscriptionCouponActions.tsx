import type { JSX } from "solid-js";
import { Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import type { SubscriptionCoupon } from "~/lib/api/endpoints/subscription-coupons";
import { formatRedemptionCount } from "../../_components/coupon-formatters";

export interface SubscriptionCouponActionsProps {
  coupon: SubscriptionCoupon;
  confirmMode: "deactivate" | "reactivate" | null;
  onConfirmModeChange: (mode: "deactivate" | "reactivate" | null) => void;
  actionLoading: boolean;
  actionError: string | null;
  onDeactivate: () => void;
  onReactivate: () => void;
}

export function SubscriptionCouponActions(props: SubscriptionCouponActionsProps) {
  return (
    <div class="space-y-4">
      <Card class="p-6 border-slate-200">
        <h2 class="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
          Redemption stats
        </h2>
        <p class="text-2xl font-bold text-slate-900">{props.coupon.redemptionCount}</p>
        <p class="text-sm text-slate-500 mt-1">Total uses</p>
        <p class="text-xs text-slate-500 mt-3">Limit: {formatRedemptionCount(props.coupon)}</p>
      </Card>

      <Card class="p-6 border-slate-200">
        <h2 class="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
          Status actions
        </h2>

        <Show when={props.coupon.isActive}>
          <Show
            when={props.confirmMode === "deactivate"}
            fallback={
              <Button
                variant="danger"
                class="w-full"
                onClick={() => props.onConfirmModeChange("deactivate")}
              >
                Deactivate coupon
              </Button>
            }
          >
            <ConfirmPanel
              message={
                <>
                  Deactivate <strong>{props.coupon.code}</strong>? Sellers will no longer be able to
                  redeem this code.
                </>
              }
              actionError={props.actionError}
              actionLoading={props.actionLoading}
              onCancel={() => props.onConfirmModeChange(null)}
              onConfirm={props.onDeactivate}
              confirmLabel="Confirm deactivate"
              confirmVariant="danger"
            />
          </Show>
        </Show>

        <Show when={!props.coupon.isActive}>
          <Show
            when={props.confirmMode === "reactivate"}
            fallback={
              <Button
                variant="primary"
                class="w-full"
                onClick={() => props.onConfirmModeChange("reactivate")}
              >
                Reactivate coupon
              </Button>
            }
          >
            <ConfirmPanel
              message={
                <>
                  Reactivate <strong>{props.coupon.code}</strong>? Sellers will be able to redeem it
                  again if within validity limits.
                </>
              }
              actionError={props.actionError}
              actionLoading={props.actionLoading}
              onCancel={() => props.onConfirmModeChange(null)}
              onConfirm={props.onReactivate}
              confirmLabel="Confirm reactivate"
              confirmVariant="primary"
            />
          </Show>
        </Show>
      </Card>
    </div>
  );
}

function ConfirmPanel(props: {
  message: JSX.Element;
  actionError: string | null;
  actionLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  confirmVariant: "primary" | "danger";
}) {
  return (
    <div class="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
      <p class="text-sm text-slate-700">{props.message}</p>
      <Show when={props.actionError}>
        <p class="text-xs text-red-600">{props.actionError}</p>
      </Show>
      <div class="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          class="flex-1"
          onClick={props.onCancel}
          disabled={props.actionLoading}
        >
          Cancel
        </Button>
        <Button
          variant={props.confirmVariant}
          size="sm"
          class="flex-1"
          isLoading={props.actionLoading}
          onClick={props.onConfirm}
        >
          {props.confirmLabel}
        </Button>
      </div>
    </div>
  );
}
