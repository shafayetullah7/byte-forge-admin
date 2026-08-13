import { Show, Suspense } from "solid-js";
import { useParams, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { getSubscriptionCoupon } from "~/lib/api/endpoints/subscription-coupons";
import { SubscriptionCouponDetailView } from "./_components/SubscriptionCouponDetailView";

export const route: RouteDefinition = {
  preload: ({ params }) => {
    getSubscriptionCoupon(params.coupon_id!);
  },
};

export default function SubscriptionCouponDetailPage() {
  const params = useParams();
  const coupon = createAsync(() => getSubscriptionCoupon(params.coupon_id!));

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Suspense
          fallback={
            <div class="animate-pulse space-y-6">
              <div class="h-4 w-48 bg-slate-100 rounded" />
              <div class="h-32 bg-slate-50 rounded-2xl" />
            </div>
          }
        >
          <Show when={coupon()} keyed>
            {(data) => (
              <>
                <Title>{data.code} | Subscription Coupons</Title>
                <Meta name="description" content={`Manage ${data.code} subscription coupon`} />
                <SubscriptionCouponDetailView coupon={data} />
              </>
            )}
          </Show>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
