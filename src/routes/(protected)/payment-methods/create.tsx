import { createMemo, createSignal, For, Show } from "solid-js";
import { useNavigate, useAction, createAsync } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { ImageUpload } from "~/components/ui/ImageUpload";
import { FormHeader } from "~/components/layout/FormHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { ApiError } from "~/lib/api/types";
import { useImageUpload } from "~/lib/hooks/useImageUpload";
import {
  createPaymentMethod,
  getPaymentMethods,
  PAYMENT_METHOD_KEYS,
  type PaymentMethodKey,
} from "~/lib/api/endpoints/payment-methods";
import { PaymentMethodLogo } from "./components/PaymentMethodLogo";

export default function CreatePaymentMethodPage() {
  const navigate = useNavigate();
  const createAction = useAction(createPaymentMethod);
  const existingMethods = createAsync(() => getPaymentMethods());
  const logoUpload = useImageUpload({ maxSizeMB: 3 });

  const availableKeys = createMemo(() => {
    const used = new Set((existingMethods() ?? []).map((m) => m.key));
    return PAYMENT_METHOD_KEYS.filter((k) => !used.has(k));
  });

  const [key, setKey] = createSignal<PaymentMethodKey | "">("");
  const [displayName, setDisplayName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [submitError, setSubmitError] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);

  const previewMethod = () => ({
    key: key() || "KEY",
    displayName: displayName() || "Display name",
    logoUrl: logoUpload.preview(),
  });

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!key()) next.key = "Select a payment method key";
    if (!displayName().trim()) next.displayName = "Display name is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createAction({
        key: key() as PaymentMethodKey,
        displayName: displayName().trim(),
        logoId: logoUpload.mediaId(),
        description: description().trim() || null,
      });
      navigate(`/payment-methods/${result.id}`);
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to create payment method";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Create Payment Method | ByteForge Admin</Title>
        <Meta name="description" content="Register a platform payment method" />

        <FormHeader
          title="Add Payment Method"
          subtitle="Register a checkout payment option. New methods start inactive until you activate them."
          backHref="/payment-methods"
          backLabel="Back to Payment Methods"
        />

        <form onSubmit={handleSubmit} class="max-w-2xl space-y-6">
          <Show when={availableKeys().length === 0}>
            <Card class="p-4 border-amber-200 bg-amber-50 text-sm text-amber-900">
              All supported payment method keys are already in the catalog. Edit an existing entry from the list page.
            </Card>
          </Show>

          <Show when={submitError()}>
            <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {submitError()}
            </div>
          </Show>

          <Card class="p-6 space-y-4">
            <div class="space-y-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Key
              </label>
              <select
                class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 disabled:bg-slate-50 disabled:text-slate-400"
                value={key()}
                disabled={availableKeys().length === 0}
                onChange={(e) => setKey(e.currentTarget.value as PaymentMethodKey | "")}
              >
                <option value="">Select a key…</option>
                <For each={availableKeys()}>
                  {(k) => <option value={k}>{k}</option>}
                </For>
              </select>
              <Show when={errors().key}>
                <p class="text-xs text-red-600">{errors().key}</p>
              </Show>
              <p class="text-xs text-slate-400">
                Must match a supported gateway enum. Keys already in the catalog cannot be added again.
              </p>
            </div>

            <Input
              label="Display Name"
              placeholder="e.g. Cash on Delivery"
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
              onDelete={logoUpload.deleteMedia}
              maxSizeMB={3}
            />

            <div class="space-y-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Description
              </label>
              <textarea
                class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 min-h-[80px] resize-y"
                placeholder="Short description for admins..."
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
              />
            </div>

            <div class="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              New methods are created as <strong>Inactive</strong>. Activate from the detail page after review.
            </div>
          </Card>

          <Show when={displayName() || key() || logoUpload.preview()}>
            <Card class="p-4">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Preview</p>
              <div class="inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary-green-600 bg-primary-green-50">
                <PaymentMethodLogo method={previewMethod()} />
                <div>
                  <p class="text-sm font-semibold text-slate-900">{displayName() || "Display name"}</p>
                  <p class="text-xs text-slate-500 font-mono">{key() || "KEY"}</p>
                </div>
              </div>
            </Card>
          </Show>

          <div class="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/payment-methods")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting()} disabled={availableKeys().length === 0}>
              Create Method
            </Button>
          </div>
        </form>
      </PageShell>
    </SafeErrorBoundary>
  );
}
