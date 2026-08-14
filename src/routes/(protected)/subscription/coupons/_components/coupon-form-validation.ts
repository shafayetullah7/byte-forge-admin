import {
  datetimeLocalToIso,
  parseOptionalMaxRedemptions,
} from "./coupon-formatters";

export type CouponFormInput = {
  code: string;
  durationValue: string;
  durationUnit: string;
  maxRedemptions: string;
  validFrom: string;
  validUntil: string;
};

export function validateCouponForm(input: CouponFormInput): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.code.trim()) {
    errors.code = "Coupon code is required";
  } else if (input.code.trim().length > 64) {
    errors.code = "Code must be 64 characters or fewer";
  }

  const duration = Number(input.durationValue);
  if (!Number.isInteger(duration) || duration <= 0) {
    errors.durationValue = "Length must be a positive whole number (e.g. 3 for three months)";
  }

  const max = parseOptionalMaxRedemptions(input.maxRedemptions);
  if (max === undefined) {
    errors.maxRedemptions = "Max redemptions must be a positive whole number or empty for unlimited";
  }

  const validFromIso = datetimeLocalToIso(input.validFrom);
  const validUntilIso = datetimeLocalToIso(input.validUntil);
  if (input.validFrom.trim() && !validFromIso) {
    errors.validFrom = "Enter a valid start date";
  }
  if (input.validUntil.trim() && !validUntilIso) {
    errors.validUntil = "Enter a valid end date";
  }
  if (validFromIso && validUntilIso && new Date(validFromIso) >= new Date(validUntilIso)) {
    errors.validUntil = "End date must be after start date";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildCouponPayload(input: CouponFormInput): {
  code: string;
  durationValue: number;
  durationUnit: "DAY" | "MONTH";
  maxRedemptions: number | null;
  validFrom: string | null;
  validUntil: string | null;
} {
  return {
    code: input.code.trim().toUpperCase(),
    durationValue: Number(input.durationValue),
    durationUnit: input.durationUnit as "DAY" | "MONTH",
    maxRedemptions: parseOptionalMaxRedemptions(input.maxRedemptions) ?? null,
    validFrom: datetimeLocalToIso(input.validFrom),
    validUntil: datetimeLocalToIso(input.validUntil),
  };
}
