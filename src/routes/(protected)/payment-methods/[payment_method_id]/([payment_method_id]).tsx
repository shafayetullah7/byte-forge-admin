import { createSignal, createEffect, Show, Suspense } from "solid-js";
import { A, useParams, createAsync, useAction, useNavigate, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { ApiError } from "~/lib/api/types";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import {
  getPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  activatePaymentMethod,
  deactivatePaymentMethod,
} from "~/lib/api/endpoints/payment-methods";
import { PaymentMethodSummaryCard } from "./_components/PaymentMethodSummaryCard";
import { PaymentMethodEditForm } from "./_components/PaymentMethodEditForm";
import { PaymentMethodStatusActions } from "./_components/PaymentMethodStatusActions";

export const route: RouteDefinition = {
  preload: ({ params }) => {
    getPaymentMethod(params.payment_method_id!);
  },
};

export default function PaymentMethodDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const method = createAsync(() => getPaymentMethod(params.payment_method_id!));
  const allMethods = createAsync(() => getPaymentMethods());

  const updateAction = useAction(updatePaymentMethod);
  const activateAction = useAction(activatePaymentMethod);
  const deactivateAction = useAction(deactivatePaymentMethod);
  const logoUpload = useImageUpload({ maxSizeMB: 3 });

  const [syncedMethodId, setSyncedMethodId] = createSignal<string | null>(null);
  const [displayName, setDisplayName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [initialLogoId, setInitialLogoId] = createSignal<string | null>(null);
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [saving, setSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal<string | null>(null);
  const [actionLoading, setActionLoading] = createSignal(false);
  const [toast, setToast] = createSignal<string | null>(null);
  const [confirmMode, setConfirmMode] = createSignal<"activate" | "deactivate" | null>(null);
  const [actionError, setActionError] = createSignal<string | null>(null);

  createEffect(() => {
    const routeId = params.payment_method_id;
    const data = method();
    if (!data || data.id !== routeId || syncedMethodId() === routeId) return;

    setSyncedMethodId(routeId);
    setDisplayName(data.displayName);
    setDescription(data.description ?? "");
    logoUpload.setExisting(data.logoId, data.logoUrl);
    setInitialLogoId(data.logoId);
    setErrors({});
    setSaveError(null);
    setConfirmMode(null);
    setActionError(null);
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const activeCount = () =>
    (allMethods() ?? []).filter((m) => m.status === "ACTIVE").length;

  const isLastActive = () => {
    const data = method();
    return data?.status === "ACTIVE" && activeCount() <= 1;
  };

  const handleLogoRemove = async () => {
    const currentId = logoUpload.mediaId();
    const savedId = initialLogoId();
    if (currentId && currentId !== savedId) {
      await logoUpload.deleteMedia();
      return;
    }
    logoUpload.clear();
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    const data = method();
    if (!data) return;

    const next: Record<string, string> = {};
    if (!displayName().trim()) next.displayName = "Display name is required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    setSaveError(null);
    try {
      const payload: {
        displayName: string;
        description: string | null;
        logoId?: string | null;
      } = {
        displayName: displayName().trim(),
        description: description().trim() || null,
      };

      if (logoUpload.mediaId() !== initialLogoId()) {
        payload.logoId = logoUpload.mediaId();
      }

      await updateAction(data.id, payload);
      setInitialLogoId(logoUpload.mediaId());
      showToast("Payment method updated");
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to save changes";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    const data = method();
    if (!data) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await activateAction(data.id);
      setConfirmMode(null);
      showToast(`"${data.displayName}" is now active at checkout`);
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to activate";
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async () => {
    const data = method();
    if (!data) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await deactivateAction(data.id);
      setConfirmMode(null);
      showToast(`"${data.displayName}" has been deactivated`);
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to deactivate";
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Show when={toast()}>
          <div class="fixed bottom-6 right-6 z-[60] px-4 py-3 rounded-xl bg-primary-green-800 text-white text-sm font-medium shadow-lg border border-primary-green-700">
            {toast()}
          </div>
        </Show>

        <Suspense
          fallback={
            <div class="animate-pulse space-y-6">
              <div class="h-4 w-48 bg-slate-100 rounded" />
              <div class="h-32 bg-slate-50 rounded-2xl" />
            </div>
          }
        >
          <Show when={method()} keyed>
            {(data) => (
              <>
                <Title>{data.displayName} | Payment Methods</Title>
                <Meta name="description" content={`Manage ${data.displayName} payment method`} />

                <nav class="flex mb-6 text-sm font-medium text-slate-500">
                  <A href="/payment-methods" class="hover:text-primary-green-700 transition-colors">
                    Payment Methods
                  </A>
                  <span class="mx-2 text-slate-300">/</span>
                  <span class="text-slate-900 font-semibold">{data.displayName}</span>
                </nav>

                <div class="flex flex-col lg:flex-row gap-8 items-start">
                  <div class="flex-1 space-y-6 w-full">
                    <PaymentMethodSummaryCard method={data} />
                    <PaymentMethodEditForm
                      methodKey={data.key}
                      displayName={displayName()}
                      onDisplayNameChange={setDisplayName}
                      description={description()}
                      onDescriptionChange={setDescription}
                      logoUpload={logoUpload}
                      onLogoRemove={handleLogoRemove}
                      errors={errors()}
                      saveError={saveError()}
                      saving={saving()}
                      onSubmit={handleSave}
                      onBack={() => navigate("/payment-methods")}
                    />
                  </div>

                  <div class="w-full lg:w-80 space-y-4">
                    <PaymentMethodStatusActions
                      method={data}
                      isLastActive={isLastActive()}
                      confirmMode={confirmMode()}
                      onConfirmModeChange={(mode) => {
                        setActionError(null);
                        setConfirmMode(mode);
                      }}
                      actionLoading={actionLoading()}
                      actionError={actionError()}
                      onActivate={handleActivate}
                      onDeactivate={handleDeactivate}
                    />
                  </div>
                </div>
              </>
            )}
          </Show>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
