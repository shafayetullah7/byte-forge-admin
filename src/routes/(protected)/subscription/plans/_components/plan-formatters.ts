export function formatBdtPrice(price: string): string {
  const numeric = Number(price);
  if (Number.isNaN(numeric)) return `৳${price}`;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatPlanDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const PRICE_BDT_PATTERN = /^\d+(\.\d{1,2})?$/;

export function validatePriceBdt(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Price is required";
  if (!PRICE_BDT_PATTERN.test(trimmed)) {
    return "Enter a valid amount (e.g. 999 or 999.50)";
  }
  return null;
}
