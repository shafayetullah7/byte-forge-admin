import { createSignal, Show } from "solid-js";
import { useAction } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { ApiError } from "~/lib/api/types";
import { extendShopSubscription } from "~/lib/api/endpoints/shop-subscription";

export interface ExtendPeriodFormProps {
  shopId: string;
  onSuccess?: () => void;
}

type ExtendUnit = "days" | "months";

export function ExtendPeriodForm(props: ExtendPeriodFormProps) {
  const extendAction = useAction(extendShopSubscription);

  const [unit, setUnit] = createSignal<ExtendUnit>("months");
  const [duration, setDuration] = createSignal("1");
  const [reason, setReason] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [submitError, setSubmitError] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    const value = Number(duration());
    if (!Number.isInteger(value) || value <= 0) {
      next.duration = "Enter a positive whole number";
    }
    if (!reason().trim()) {
      next.reason = "Reason is required for audit trail";
    } else if (reason().trim().length > 500) {
      next.reason = "Reason must be 500 characters or fewer";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload =
        unit() === "days"
          ? { days: Number(duration()), reason: reason().trim() }
          : { months: Number(duration()), reason: reason().trim() };

      await extendAction(props.shopId, payload);
      setDuration("1");
      setReason("");
      props.onSuccess?.();
    } catch (err: unknown) {
      setSubmitError(formatError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card class="p-6 border-slate-200">
      <h3 class="text-base font-bold text-slate-900 mb-1">Extend period</h3>
      <p class="text-sm text-slate-500 mb-6">
        Manually extend this shop's subscription. Creates an admin invoice record.
      </p>

      <form onSubmit={handleSubmit} class="space-y-4">
        <Show when={submitError()}>
          <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {submitError()}
          </div>
        </Show>

        <div class="flex gap-2">
          <button
            type="button"
            class={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              unit() === "months"
                ? "bg-primary-green-50 border-primary-green-200 text-primary-green-800"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => setUnit("months")}
          >
            Months
          </button>
          <button
            type="button"
            class={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              unit() === "days"
                ? "bg-primary-green-50 border-primary-green-200 text-primary-green-800"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => setUnit("days")}
          >
            Days
          </button>
        </div>

        <Input
          label={unit() === "months" ? "Months to add" : "Days to add"}
          placeholder="1"
          value={duration()}
          onInput={(e) => setDuration(e.currentTarget.value)}
          error={errors().duration}
        />

        <div class="space-y-2">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Reason
          </label>
          <textarea
            class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-primary-green-500 focus:outline-none focus:ring-2 focus:ring-primary-green-500/20 min-h-[80px] resize-y"
            placeholder="e.g. Founding seller concierge extension"
            value={reason()}
            onInput={(e) => setReason(e.currentTarget.value)}
          />
          <Show when={errors().reason}>
            <p class="text-xs text-red-600">{errors().reason}</p>
          </Show>
        </div>

        <Button type="submit" variant="primary" class="w-full" isLoading={submitting()}>
          Extend subscription
        </Button>
      </form>
    </Card>
  );
}

function formatError(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Failed to extend subscription";
}
