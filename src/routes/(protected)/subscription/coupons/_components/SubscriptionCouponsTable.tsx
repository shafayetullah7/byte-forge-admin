import { For } from "solid-js";
import { A } from "@solidjs/router";
import { Card } from "~/components/ui/Card";
import { ClipboardDocumentListIcon } from "~/components/icons";
import type { SubscriptionCoupon } from "~/lib/api/endpoints/subscription-coupons";
import {
  formatCouponDate,
  formatCouponDuration,
  formatRedemptionCount,
} from "./coupon-formatters";
import { CouponStatusBadge } from "./CouponStatusBadge";

export function SubscriptionCouponsTable(props: { coupons: SubscriptionCoupon[] }) {
  return (
    <Card class="overflow-hidden border-slate-200 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200">
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Code
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Access granted
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Redemptions
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Validity
              </th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <For
              each={props.coupons}
              fallback={
                <tr>
                  <td colspan="5" class="px-6 py-16 text-center">
                    <div class="flex flex-col items-center">
                      <ClipboardDocumentListIcon class="w-10 h-10 text-slate-300 mb-3" />
                      <p class="text-sm font-semibold text-slate-500">No coupons found</p>
                      <p class="text-xs text-slate-400 mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              }
            >
              {(coupon) => (
                <tr class="group hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <A
                      href={`/subscription/coupons/${coupon.id}`}
                      class="font-mono font-bold text-slate-900 hover:text-primary-green-700 transition-colors"
                    >
                      {coupon.code}
                    </A>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-700">
                    {formatCouponDuration(coupon.durationValue, coupon.durationUnit)}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-700">
                    {formatRedemptionCount(coupon)}
                    <ShowRemaining remaining={coupon.redemptionsRemaining} />
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">
                    <p>{formatCouponDate(coupon.validFrom)} → {formatCouponDate(coupon.validUntil)}</p>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <CouponStatusBadge isActive={coupon.isActive} />
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
        <p class="text-sm text-slate-500">
          Showing <span class="font-medium text-slate-700">{props.coupons.length}</span> coupon
          {props.coupons.length === 1 ? "" : "s"}
        </p>
      </div>
    </Card>
  );
}

function ShowRemaining(props: { remaining: number | null }) {
  if (props.remaining === null) return null;
  return <p class="text-xs text-slate-400 mt-0.5">{props.remaining} remaining</p>;
}
