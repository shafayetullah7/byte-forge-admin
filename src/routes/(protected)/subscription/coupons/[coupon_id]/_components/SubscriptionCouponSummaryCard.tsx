import { Card } from "~/components/ui/Card";
import type { SubscriptionCoupon } from "~/lib/api/endpoints/subscription-coupons";
import {
  formatCouponDate,
  formatCouponDuration,
  formatRedemptionCount,
} from "../../_components/coupon-formatters";
import { CouponStatusBadge } from "../../_components/CouponStatusBadge";

export function SubscriptionCouponSummaryCard(props: { coupon: SubscriptionCoupon }) {
  return (
    <Card class="p-6">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold font-mono text-slate-900">{props.coupon.code}</h1>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <span class="text-sm font-semibold text-slate-700">
              {formatCouponDuration(props.coupon.durationValue, props.coupon.durationUnit)}
            </span>
            <CouponStatusBadge isActive={props.coupon.isActive} />
          </div>
        </div>
      </div>

      <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <dt class="text-slate-500">Redemptions</dt>
          <dd class="text-slate-900 font-bold mt-1">{formatRedemptionCount(props.coupon)}</dd>
          <ShowRemaining remaining={props.coupon.redemptionsRemaining} />
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <dt class="text-slate-500">Valid from</dt>
          <dd class="text-slate-900 font-medium mt-1">{formatCouponDate(props.coupon.validFrom)}</dd>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <dt class="text-slate-500">Valid until</dt>
          <dd class="text-slate-900 font-medium mt-1">{formatCouponDate(props.coupon.validUntil)}</dd>
        </div>
        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <dt class="text-slate-500">Updated</dt>
          <dd class="text-slate-900 font-medium mt-1">{formatCouponDate(props.coupon.updatedAt)}</dd>
        </div>
      </dl>
    </Card>
  );
}

function ShowRemaining(props: { remaining: number | null }) {
  if (props.remaining === null) return null;
  return <p class="text-xs text-slate-500 mt-1">{props.remaining} remaining</p>;
}
