export type PaymentMethodStatus = "ACTIVE" | "INACTIVE";

export type PaymentMethodKey =
  | "COD"
  | "CARD"
  | "BKASH"
  | "NAGAD"
  | "SSLCOMMERCE";

export interface PaymentMethod {
  id: string;
  key: string;
  displayName: string;
  logoId: string | null;
  logoUrl: string | null;
  status: PaymentMethodStatus;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodDto {
  key: PaymentMethodKey;
  displayName: string;
  logoId?: string | null;
  description?: string | null;
}

export interface UpdatePaymentMethodDto {
  displayName?: string;
  logoId?: string | null;
  description?: string | null;
}

export const PAYMENT_METHOD_KEYS: PaymentMethodKey[] = [
  "COD",
  "CARD",
  "BKASH",
  "NAGAD",
  "SSLCOMMERCE",
];
