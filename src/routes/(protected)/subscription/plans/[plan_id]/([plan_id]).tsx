import { Show, Suspense } from "solid-js";
import { useParams, createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { getSubscriptionPlan } from "~/lib/api/endpoints/subscription-plans";
import { SubscriptionPlanDetailView } from "./_components/SubscriptionPlanDetailView";

export const route: RouteDefinition = {
  preload: ({ params }) => {
    getSubscriptionPlan(params.plan_id!);
  },
};

export default function SubscriptionPlanDetailPage() {
  const params = useParams();
  const plan = createAsync(() => getSubscriptionPlan(params.plan_id!));

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
          <Show when={plan()} keyed>
            {(data) => (
              <>
                <Title>{data.name} | Subscription Plans</Title>
                <Meta name="description" content={`Manage ${data.name} subscription plan`} />
                <SubscriptionPlanDetailView plan={data} />
              </>
            )}
          </Show>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
