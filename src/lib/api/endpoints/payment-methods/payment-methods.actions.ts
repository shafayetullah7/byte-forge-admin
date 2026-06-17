"use action";
import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  CreatePaymentMethodDto,
  PaymentMethod,
  UpdatePaymentMethodDto,
} from "./payment-methods.types";

function revalidatePaymentMethods(id?: string) {
  revalidate("payment-methods-list");
  if (id) {
    revalidate(["payment-method-detail", id]);
  } else {
    revalidate("payment-method-detail");
  }
}

export const createPaymentMethod = action(async (data: CreatePaymentMethodDto) => {
  const result = await apiClient<PaymentMethod>("/admin/payment-methods", {
    method: "POST",
    body: JSON.stringify(data),
  });
  revalidatePaymentMethods();
  return result;
}, "create-payment-method");

export const updatePaymentMethod = action(
  async (id: string, data: UpdatePaymentMethodDto) => {
    const result = await apiClient<PaymentMethod>(`/admin/payment-methods/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    revalidatePaymentMethods(id);
    return result;
  },
  "update-payment-method",
);

export const activatePaymentMethod = action(async (id: string) => {
  const result = await apiClient<PaymentMethod>(
    `/admin/payment-methods/${id}/activate`,
    { method: "PATCH" },
  );
  revalidatePaymentMethods(id);
  return result;
}, "activate-payment-method");

export const deactivatePaymentMethod = action(async (id: string) => {
  const result = await apiClient<PaymentMethod>(
    `/admin/payment-methods/${id}/deactivate`,
    { method: "PATCH" },
  );
  revalidatePaymentMethods(id);
  return result;
}, "deactivate-payment-method");
