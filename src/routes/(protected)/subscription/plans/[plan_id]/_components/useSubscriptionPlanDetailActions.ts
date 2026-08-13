import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import { ApiError } from "~/lib/api/types";
import {
  updateSubscriptionPlan,
  syncSubscriptionPlanToStripe,
  retireSubscriptionPlan,
  type SubscriptionPlan,
  type SubscriptionPlanInterval,
} from "~/lib/api/endpoints/subscription-plans";
import { validateEditPlanForm } from "../../_components/plan-form-validation";

export function useSubscriptionPlanDetailActions(plan: () => SubscriptionPlan) {
  const updateAction = useAction(updateSubscriptionPlan);
  const syncAction = useAction(syncSubscriptionPlanToStripe);
  const retireAction = useAction(retireSubscriptionPlan);

  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [interval, setInterval] = createSignal<SubscriptionPlanInterval>("MONTH");
  const [priceBdt, setPriceBdt] = createSignal("");
  const [sortOrder, setSortOrder] = createSignal("0");
  const [isActiveForNew, setIsActiveForNew] = createSignal(true);
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [saving, setSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal<string | null>(null);
  const [syncLoading, setSyncLoading] = createSignal(false);
  const [syncError, setSyncError] = createSignal<string | null>(null);
  const [retireLoading, setRetireLoading] = createSignal(false);
  const [retireError, setRetireError] = createSignal<string | null>(null);
  const [confirmMode, setConfirmMode] = createSignal<"retire" | null>(null);
  const [toast, setToast] = createSignal<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = (data: SubscriptionPlan) => {
    setName(data.name);
    setDescription(data.description ?? "");
    setInterval(data.interval);
    setPriceBdt(data.priceBdt);
    setSortOrder(String(data.sortOrder));
    setIsActiveForNew(data.isActiveForNew);
    setErrors({});
    setSaveError(null);
    setSyncError(null);
    setRetireError(null);
    setConfirmMode(null);
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    const data = plan();
    if (data.isRetired) return;

    const validation = validateEditPlanForm({
      name: name(),
      priceBdt: priceBdt(),
      sortOrder: sortOrder(),
    });
    setErrors(validation.errors);
    if (!validation.valid) return;

    setSaving(true);
    setSaveError(null);
    try {
      await updateAction(data.id, {
        name: name().trim(),
        description: description().trim() || null,
        interval: interval(),
        priceBdt: priceBdt().trim(),
        sortOrder: Number(sortOrder()),
        isActiveForNew: isActiveForNew(),
      });
      showToast("Plan updated");
    } catch (err: unknown) {
      setSaveError(formatError(err, "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  };

  const handleSyncStripe = async () => {
    setSyncLoading(true);
    setSyncError(null);
    try {
      await syncAction(plan().id);
      showToast("Plan synced to Stripe");
    } catch (err: unknown) {
      setSyncError(formatError(err, "Stripe sync failed"));
    } finally {
      setSyncLoading(false);
    }
  };

  const handleRetire = async () => {
    setRetireLoading(true);
    setRetireError(null);
    try {
      await retireAction(plan().id);
      setConfirmMode(null);
      showToast(`"${plan().name}" has been retired`);
    } catch (err: unknown) {
      setRetireError(formatError(err, "Failed to retire plan"));
    } finally {
      setRetireLoading(false);
    }
  };

  return {
    name,
    setName,
    description,
    setDescription,
    interval,
    setInterval,
    priceBdt,
    setPriceBdt,
    sortOrder,
    setSortOrder,
    isActiveForNew,
    setIsActiveForNew,
    errors,
    saving,
    saveError,
    syncLoading,
    syncError,
    retireLoading,
    retireError,
    confirmMode,
    setConfirmMode,
    setRetireError,
    toast,
    resetForm,
    handleSave,
    handleSyncStripe,
    handleRetire,
  };
}

function formatError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}
