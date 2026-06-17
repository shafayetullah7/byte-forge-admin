import { createSignal, createEffect, Show, Suspense } from "solid-js";
import { A, useParams, createAsync, useAction, useNavigate, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { ImageUpload } from "~/components/ui/ImageUpload";
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
import { PaymentMethodLogo } from "../components/PaymentMethodLogo";
import { formatDate } from "../components/format-date";

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
    const data = method();
    if (data) {
      setDisplayName(data.displayName);
      setDescription(data.description ?? "");
      logoUpload.setExisting(data.logoId, data.logoUrl);
      setInitialLogoId(data.logoId);
    }
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
                    <Card class="p-6">
                      <div class="flex items-start gap-4 mb-6">
                        <PaymentMethodLogo method={data} size="lg" />
                        <div>
                          <h1 class="text-2xl font-bold text-slate-900">{data.displayName}</h1>
                          <div class="flex items-center gap-2 mt-2">
                            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                              {data.key}
                            </span>
                            <Badge variant={data.status === "ACTIVE" ? "success" : "secondary"} size="sm">
                              {data.status}
                            </Badge>
                          </div>
                          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                            <div>
                              <dt class="text-slate-500">Created</dt>
                              <dd class="text-slate-800 font-medium">{formatDate(data.createdAt)}</dd>
                            </div>
                            <div>
                              <dt class="text-slate-500">Last updated</dt>
                              <dd class="text-slate-800 font-medium">{formatDate(data.updatedAt)}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>

                      <Show when={data.description}>
                        <div class="pt-4 border-t border-slate-100">
                          <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Description
                          </p>
                          <p class="text-sm text-slate-700">{data.description}</p>
                        </div>
                      </Show>
                    </Card>

                    <Card class="p-6">
                      <h2 class="text-base font-bold text-slate-900 mb-6">Edit details</h2>
                      <form onSubmit={handleSave} class="space-y-4">
                        <Show when={saveError()}>
                          <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                            {saveError()}
                          </div>
                        </Show>
                        <Input
                          label="Display Name"
                          value={displayName()}
                          onInput={(e) => setDisplayName(e.currentTarget.value)}
                          error={errors().displayName}
                        />
                        <ImageUpload
                          label="Logo"
                          preview={logoUpload.preview()}
                          isUploading={logoUpload.isUploading}
                          isDeleting={logoUpload.isDeleting}
                          error={logoUpload.uploadError()}
                          onFileSelect={logoUpload.upload}
                          onDelete={handleLogoRemove}
                          maxSizeMB={3}
                        />
                        <div class="space-y-2">
                          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Description
                          </label>
                          <textarea
                            class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 min-h-[80px] resize-y"
                            value={description()}
                            onInput={(e) => setDescription(e.currentTarget.value)}
                          />
                        </div>
                        <p class="text-xs text-slate-400">
                          Key <span class="font-mono font-semibold">{data.key}</span> cannot be changed after creation.
                        </p>
                        <div class="flex justify-end gap-3 pt-2">
                          <Button type="button" variant="outline" onClick={() => navigate("/payment-methods")}>
                            Back
                          </Button>
                          <Button type="submit" variant="primary" isLoading={saving()}>
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </div>

                  <div class="w-full lg:w-80 space-y-4">
                    <Card class="p-6 border-slate-200">
                      <h2 class="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
                        Status actions
                      </h2>

                      <Show when={data.status === "INACTIVE"}>
                        <Show
                          when={confirmMode() === "activate"}
                          fallback={
                            <Button
                              variant="primary"
                              class="w-full"
                              onClick={() => {
                                setActionError(null);
                                setConfirmMode("activate");
                              }}
                            >
                              Activate for checkout
                            </Button>
                          }
                        >
                          <div class="space-y-3 p-4 rounded-xl bg-primary-green-50 border border-primary-green-200">
                            <p class="text-sm text-slate-700">
                              Activate <strong>{data.displayName}</strong>? Buyers will be able to select this method at checkout.
                            </p>
                            <Show when={actionError()}>
                              <p class="text-xs text-red-600">{actionError()}</p>
                            </Show>
                            <div class="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                class="flex-1"
                                onClick={() => setConfirmMode(null)}
                                disabled={actionLoading()}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                class="flex-1"
                                isLoading={actionLoading()}
                                onClick={handleActivate}
                              >
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </Show>
                      </Show>

                      <Show when={data.status === "ACTIVE"}>
                        <Show
                          when={confirmMode() === "deactivate"}
                          fallback={
                            <Button
                              variant="danger"
                              class="w-full"
                              onClick={() => {
                                setActionError(null);
                                setConfirmMode("deactivate");
                              }}
                            >
                              Deactivate
                            </Button>
                          }
                        >
                          <div class="space-y-3 p-4 rounded-xl bg-red-50 border border-red-200">
                            <p class="text-sm text-slate-700">
                              Deactivate <strong>{data.displayName}</strong>? It will be hidden from checkout.
                            </p>
                            <Show when={isLastActive()}>
                              <p class="text-xs text-red-800 bg-white/80 border border-red-200 rounded-lg p-2">
                                This is the only active payment method. Deactivating it would leave checkout with no payment options.
                              </p>
                            </Show>
                            <Show when={actionError()}>
                              <p class="text-xs text-red-600">{actionError()}</p>
                            </Show>
                            <div class="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                class="flex-1"
                                onClick={() => setConfirmMode(null)}
                                disabled={actionLoading()}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                class="flex-1"
                                isLoading={actionLoading()}
                                onClick={handleDeactivate}
                                disabled={isLastActive()}
                              >
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </Show>
                      </Show>
                    </Card>
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
