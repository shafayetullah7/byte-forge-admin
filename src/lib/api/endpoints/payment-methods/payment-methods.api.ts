import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { PaymentMethod } from "./payment-methods.types";

export const getPaymentMethods = query(async () => {
  return apiClient<PaymentMethod[]>("/admin/payment-methods");
}, "payment-methods-list");

export const getPaymentMethod = query(async (id: string) => {
  return apiClient<PaymentMethod>(`/admin/payment-methods/${id}`);
}, "payment-method-detail");
