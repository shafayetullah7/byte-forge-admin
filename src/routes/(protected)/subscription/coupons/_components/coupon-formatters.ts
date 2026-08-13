export function formatCouponDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCouponDuration(value: number, unit: string): string {
  const label = unit === "MONTH" ? "month" : "day";
  return `${value} ${value === 1 ? label : `${label}s`}`;
}

export function formatRedemptionCount(coupon: {
  redemptionCount: number;
  maxRedemptions: number | null;
  redemptionsRemaining: number | null;
}): string {
  if (coupon.maxRedemptions === null) {
    return `${coupon.redemptionCount} / unlimited`;
  }
  return `${coupon.redemptionCount} / ${coupon.maxRedemptions}`;
}

export function toDatetimeLocalValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function datetimeLocalToIso(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function parseOptionalMaxRedemptions(value: string): number | null | undefined {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;
  return parsed;
}
