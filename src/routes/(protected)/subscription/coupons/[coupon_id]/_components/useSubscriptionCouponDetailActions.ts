import { createSignal } from "solid-js";
import { useAction } from "@solidjs/router";
import { ApiError } from "~/lib/api/types";
import {
  updateSubscriptionCoupon,
  deactivateSubscriptionCoupon,
  type SubscriptionCoupon,
  type SubscriptionCouponDurationUnit,
} from "~/lib/api/endpoints/subscription-coupons";
import {
  buildCouponPayload,
  validateCouponForm,
  type CouponFormInput,
} from "../../_components/coupon-form-validation";
import { toDatetimeLocalValue } from "../../_components/coupon-formatters";

export function useSubscriptionCouponDetailActions(coupon: () => SubscriptionCoupon) {
  const updateAction = useAction(updateSubscriptionCoupon);
  const deactivateAction = useAction(deactivateSubscriptionCoupon);

  const [code, setCode] = createSignal("");
  const [durationValue, setDurationValue] = createSignal("1");
  const [durationUnit, setDurationUnit] = createSignal<SubscriptionCouponDurationUnit>("MONTH");
  const [maxRedemptions, setMaxRedemptions] = createSignal("");
  const [validFrom, setValidFrom] = createSignal("");
  const [validUntil, setValidUntil] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [saving, setSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal<string | null>(null);
  const [actionLoading, setActionLoading] = createSignal(false);
  const [actionError, setActionError] = createSignal<string | null>(null);
  const [confirmMode, setConfirmMode] = createSignal<"deactivate" | "reactivate" | null>(null);
  const [toast, setToast] = createSignal<string | null>(null);

  const formInput = (): CouponFormInput => ({
    code: code(),
    durationValue: durationValue(),
    durationUnit: durationUnit(),
    maxRedemptions: maxRedemptions(),
    validFrom: validFrom(),
    validUntil: validUntil(),
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = (data: SubscriptionCoupon) => {
    setCode(data.code);
    setDurationValue(String(data.durationValue));
    setDurationUnit(data.durationUnit);
    setMaxRedemptions(data.maxRedemptions === null ? "" : String(data.maxRedemptions));
    setValidFrom(toDatetimeLocalValue(data.validFrom));
    setValidUntil(toDatetimeLocalValue(data.validUntil));
    setErrors({});
    setSaveError(null);
    setActionError(null);
    setConfirmMode(null);
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    if (!coupon().isActive) return;

    const validation = validateCouponForm(formInput());
    setErrors(validation.errors);
    if (!validation.valid) return;

    setSaving(true);
    setSaveError(null);
    try {
      await updateAction(coupon().id, buildCouponPayload(formInput()));
      showToast("Coupon updated");
    } catch (err: unknown) {
      setSaveError(formatError(err, "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await deactivateAction(coupon().id);
      setConfirmMode(null);
      showToast(`"${coupon().code}" has been deactivated`);
    } catch (err: unknown) {
      setActionError(formatError(err, "Failed to deactivate coupon"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await updateAction(coupon().id, { isActive: true });
      setConfirmMode(null);
      showToast(`"${coupon().code}" is active again`);
    } catch (err: unknown) {
      setActionError(formatError(err, "Failed to reactivate coupon"));
    } finally {
      setActionLoading(false);
    }
  };

  return {
    code,
    setCode,
    durationValue,
    setDurationValue,
    durationUnit,
    setDurationUnit,
    maxRedemptions,
    setMaxRedemptions,
    validFrom,
    setValidFrom,
    validUntil,
    setValidUntil,
    errors,
    saving,
    saveError,
    actionLoading,
    actionError,
    confirmMode,
    setConfirmMode,
    setActionError,
    toast,
    resetForm,
    handleSave,
    handleDeactivate,
    handleReactivate,
  };
}

function formatError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}
