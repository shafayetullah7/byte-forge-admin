import { createSignal, Show, Suspense } from "solid-js";
import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { getShopSubscription } from "~/lib/api/endpoints/shop-subscription";
import { SubscriptionStatusCard } from "./_components/SubscriptionStatusCard";
import { ExtendPeriodForm } from "./_components/ExtendPeriodForm";
import { RecentInvoicesSnippet } from "./_components/RecentInvoicesSnippet";

export const route: RouteDefinition = {
  preload: ({ params }) => getShopSubscription(params.shop_id!),
};

export default function ShopSubscriptionRoute() {
  const params = useParams();
  const shopId = () => params.shop_id!;
  const subscriptionData = createAsync(() => getShopSubscription(shopId()));
  const [toast, setToast] = createSignal<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <Show when={toast()}>
        <div class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl bg-primary-green-800 text-white text-sm font-medium shadow-lg border border-primary-green-700">
          {toast()}
        </div>
      </Show>

      <Suspense
        fallback={
          <div class="space-y-6 animate-pulse">
            <div class="h-40 bg-slate-50 rounded-2xl border border-slate-200" />
            <div class="h-64 bg-slate-50 rounded-2xl border border-slate-200" />
          </div>
        }
      >
        <Show when={subscriptionData()} keyed>
          {(subscription) => (
            <div class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div class="lg:col-span-2 space-y-6">
                  <SubscriptionStatusCard subscription={subscription} />
                  <RecentInvoicesSnippet invoices={subscription.recentInvoices} />
                </div>
                <ExtendPeriodForm
                  shopId={shopId()}
                  onSuccess={() => showToast("Subscription period extended")}
                />
              </div>
            </div>
          )}
        </Show>
      </Suspense>
    </SafeErrorBoundary>
  );
}
