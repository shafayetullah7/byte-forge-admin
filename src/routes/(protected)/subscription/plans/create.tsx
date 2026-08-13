import { createSignal, Show } from "solid-js";
import { useNavigate, useAction } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";
import { FormHeader } from "~/components/layout/FormHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { ApiError } from "~/lib/api/types";
import {
  createSubscriptionPlan,
  SUBSCRIPTION_PLAN_INTERVALS,
  SUBSCRIPTION_PLAN_INTERVAL_LABELS,
  type SubscriptionPlanInterval,
} from "~/lib/api/endpoints/subscription-plans";
import { SubscriptionPlanFormFields } from "./_components/SubscriptionPlanFormFields";
import { validateCreatePlanForm } from "./_components/plan-form-validation";

export default function CreateSubscriptionPlanPage() {
  const navigate = useNavigate();
  const createAction = useAction(createSubscriptionPlan);

  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [interval, setInterval] = createSignal<SubscriptionPlanInterval>("MONTH");
  const [priceBdt, setPriceBdt] = createSignal("");
  const [sortOrder, setSortOrder] = createSignal("0");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [submitError, setSubmitError] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const validation = validateCreatePlanForm({
      name: name(),
      priceBdt: priceBdt(),
      sortOrder: sortOrder(),
    });
    setErrors(validation.errors);
    if (!validation.valid) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createAction({
        name: name().trim(),
        description: description().trim() || null,
        interval: interval(),
        priceBdt: priceBdt().trim(),
        sortOrder: Number(sortOrder()),
      });
      navigate(`/subscription/plans/${result.id}`);
    } catch (err: unknown) {
      setSubmitError(formatError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Create Subscription Plan | ByteForge Admin</Title>
        <Meta name="description" content="Create a seller subscription plan" />

        <FormHeader
          title="Add Subscription Plan"
          subtitle="New plans are active for new purchases by default. Sync to Stripe from the detail page before sellers can checkout."
          backHref="/subscription/plans"
          backLabel="Back to Subscription Plans"
        />

        <form onSubmit={handleSubmit} class="max-w-2xl space-y-6">
          <Show when={submitError()}>
            <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {submitError()}
            </div>
          </Show>

          <Card class="p-6 space-y-4">
            <SubscriptionPlanFormFields
              name={name()}
              onNameChange={setName}
              description={description()}
              onDescriptionChange={setDescription}
              interval={interval()}
              onIntervalChange={setInterval}
              priceBdt={priceBdt()}
              onPriceBdtChange={setPriceBdt}
              sortOrder={sortOrder()}
              onSortOrderChange={setSortOrder}
              errors={errors()}
            />

            <div class="p-3 rounded-lg bg-primary-green-50 border border-primary-green-100 text-xs text-primary-green-900">
              After creating the plan, open its detail page and use <strong>Sync to Stripe</strong>{" "}
              before sellers can subscribe via checkout.
            </div>
          </Card>

          <div class="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/subscription/plans")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting()}>
              Create Plan
            </Button>
          </div>
        </form>
      </PageShell>
    </SafeErrorBoundary>
  );
}

function formatError(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Failed to create subscription plan";
}
