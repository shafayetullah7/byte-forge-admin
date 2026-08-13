import { createSignal, createEffect, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import type { SubscriptionPlan } from "~/lib/api/endpoints/subscription-plans";
import { SubscriptionPlanSummaryCard } from "./SubscriptionPlanSummaryCard";
import { SubscriptionPlanEditForm } from "./SubscriptionPlanEditForm";
import { SubscriptionPlanActions } from "./SubscriptionPlanActions";
import { useSubscriptionPlanDetailActions } from "./useSubscriptionPlanDetailActions";

export function SubscriptionPlanDetailView(props: { plan: SubscriptionPlan }) {
  const navigate = useNavigate();
  const plan = () => props.plan;
  const actions = useSubscriptionPlanDetailActions(plan);
  const [syncedPlanId, setSyncedPlanId] = createSignal<string | null>(null);

  createEffect(() => {
    const data = props.plan;
    if (syncedPlanId() === data.id) return;
    setSyncedPlanId(data.id);
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
        <A href="/subscription/plans" class="hover:text-primary-green-700 transition-colors">
          Subscription Plans
        </A>
        <span class="mx-2 text-slate-300">/</span>
        <span class="text-slate-900 font-semibold">{props.plan.name}</span>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8 items-start">
        <div class="flex-1 space-y-6 w-full">
          <SubscriptionPlanSummaryCard plan={props.plan} />
          <SubscriptionPlanEditForm
            plan={props.plan}
            name={actions.name()}
            onNameChange={actions.setName}
            description={actions.description()}
            onDescriptionChange={actions.setDescription}
            interval={actions.interval()}
            onIntervalChange={actions.setInterval}
            priceBdt={actions.priceBdt()}
            onPriceBdtChange={actions.setPriceBdt}
            sortOrder={actions.sortOrder()}
            onSortOrderChange={actions.setSortOrder}
            isActiveForNew={actions.isActiveForNew()}
            onIsActiveForNewChange={actions.setIsActiveForNew}
            errors={actions.errors()}
            saveError={actions.saveError()}
            saving={actions.saving()}
            onSubmit={actions.handleSave}
            onBack={() => navigate("/subscription/plans")}
          />
        </div>

        <div class="w-full lg:w-80">
          <SubscriptionPlanActions
            plan={props.plan}
            confirmMode={actions.confirmMode()}
            onConfirmModeChange={(mode) => {
              actions.setRetireError(null);
              actions.setConfirmMode(mode);
            }}
            syncLoading={actions.syncLoading()}
            retireLoading={actions.retireLoading()}
            syncError={actions.syncError()}
            retireError={actions.retireError()}
            onSyncStripe={actions.handleSyncStripe}
            onRetire={actions.handleRetire}
          />
        </div>
      </div>
    </>
  );
}
