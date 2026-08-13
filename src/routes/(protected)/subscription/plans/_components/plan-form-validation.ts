import { validatePriceBdt } from "./plan-formatters";

export function validateCreatePlanForm(input: {
  name: string;
  priceBdt: string;
  sortOrder: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!input.name.trim()) errors.name = "Plan name is required";

  const priceError = validatePriceBdt(input.priceBdt);
  if (priceError) errors.priceBdt = priceError;

  const sort = Number(input.sortOrder);
  if (Number.isNaN(sort) || sort < 0 || !Number.isInteger(sort)) {
    errors.sortOrder = "Sort order must be a whole number ≥ 0";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateEditPlanForm(input: {
  name: string;
  priceBdt: string;
  sortOrder: string;
}): { valid: boolean; errors: Record<string, string> } {
  return validateCreatePlanForm(input);
}
