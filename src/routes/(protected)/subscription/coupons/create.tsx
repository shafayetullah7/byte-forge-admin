import { createSignal, Show } from "solid-js";
import { useNavigate, useAction } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { FormHeader } from "~/components/layout/FormHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { ApiError } from "~/lib/api/types";
import {
  createSubscriptionCoupon,
  type SubscriptionCouponDurationUnit,
} from "~/lib/api/endpoints/subscription-coupons";
import { SubscriptionCouponFormFields } from "./_components/SubscriptionCouponFormFields";
import { buildCouponPayload, validateCouponForm } from "./_components/coupon-form-validation";

export default function CreateSubscriptionCouponPage() {
  const navigate = useNavigate();
  const createAction = useAction(createSubscriptionCoupon);

  const [code, setCode] = createSignal("");
  const [durationValue, setDurationValue] = createSignal("1");
  const [durationUnit, setDurationUnit] = createSignal<SubscriptionCouponDurationUnit>("MONTH");
  const [maxRedemptions, setMaxRedemptions] = createSignal("");
  const [validFrom, setValidFrom] = createSignal("");
  const [validUntil, setValidUntil] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [submitError, setSubmitError] = createSignal<string | null>(null);
  const [submitting, setSubmitting] = createSignal(false);

  const formInput = () => ({
    code: code(),
    durationValue: durationValue(),
    durationUnit: durationUnit(),
    maxRedemptions: maxRedemptions(),
    validFrom: validFrom(),
    validUntil: validUntil(),
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const validation = validateCouponForm(formInput());
    setErrors(validation.errors);
    if (!validation.valid) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createAction(buildCouponPayload(formInput()));
      navigate(`/subscription/coupons/${result.id}`);
    } catch (err: unknown) {
      setSubmitError(formatError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Create Subscription Coupon | ByteForge Admin</Title>
        <Meta name="description" content="Create a seller subscription coupon" />

        <FormHeader
          title="Add Subscription Coupon"
          subtitle="Coupons grant free subscription time when redeemed. Set access length separately from when the code can be used."
          backHref="/subscription/coupons"
          backLabel="Back to Subscription Coupons"
        />

        <form onSubmit={handleSubmit} class="max-w-2xl space-y-6">
          <Show when={submitError()}>
            <div class="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {submitError()}
            </div>
          </Show>

          <Card class="p-6 space-y-4">
            <SubscriptionCouponFormFields
              code={code()}
              onCodeChange={setCode}
              durationValue={durationValue()}
              onDurationValueChange={setDurationValue}
              durationUnit={durationUnit()}
              onDurationUnitChange={setDurationUnit}
              maxRedemptions={maxRedemptions()}
              onMaxRedemptionsChange={setMaxRedemptions}
              validFrom={validFrom()}
              onValidFromChange={setValidFrom}
              validUntil={validUntil()}
              onValidUntilChange={setValidUntil}
              errors={errors()}
            />
          </Card>

          <div class="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/subscription/coupons")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting()}>
              Create Coupon
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
  return "Failed to create subscription coupon";
}
