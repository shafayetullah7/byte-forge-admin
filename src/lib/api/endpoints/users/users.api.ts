import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { PaginatedResponse, PaginatedResult, PaginationMeta } from "../../types";
import type { AdminOrderSummary } from "../orders/orders.types";
import type { AdminUserDetail, AdminUserFilter, AdminUserSummary } from "./users.types";

const BASE_PATH = "/admin/users";

type PaginatedApiMeta = PaginationMeta & { pages?: number };

function normalizeMeta(meta: PaginatedApiMeta): PaginationMeta {
  const totalPages = meta.totalPages ?? meta.pages ?? 1;
  return {
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
    totalPages,
    hasNext: meta.hasNext ?? meta.page < totalPages,
    hasPrevious: meta.hasPrevious ?? meta.page > 1,
  };
}

function unwrapPaginated<T>(response: unknown): PaginatedResult<T> {
  if (response && typeof response === "object" && "data" in response && "meta" in response) {
    const paginated = response as PaginatedResponse<T>;
    return {
      data: paginated.data,
      meta: normalizeMeta(paginated.meta as PaginatedApiMeta),
    };
  }

  throw new Error("Users API returned unexpected paginated format");
}

export const getAdminUsers = query(async (filter?: AdminUserFilter) => {
  const params: Record<string, string | number | boolean | undefined> = {};
  if (filter) {
    if (filter.page !== undefined) params.page = filter.page;
    if (filter.limit !== undefined) params.limit = filter.limit;
    if (filter.search) params.search = filter.search;
    if (filter.sortBy) params.sortBy = filter.sortBy;
    if (filter.sortOrder) params.sortOrder = filter.sortOrder;
    if (filter.buyersOnly === false) params.buyersOnly = "false";
  }

  const response = await apiClient<PaginatedResponse<AdminUserSummary>>(BASE_PATH, {
    params,
    unwrapData: false,
  });

  return unwrapPaginated<AdminUserSummary>(response);
}, "admin-users");

export const getAdminUser = query(async (userId: string) => {
  return apiClient<AdminUserDetail>(`${BASE_PATH}/${userId}`);
}, "admin-user-detail");

export const getAdminUserOrders = query(async (userId: string) => {
  const response = await apiClient<PaginatedResponse<AdminOrderSummary>>(
    `${BASE_PATH}/${userId}/orders`,
    { unwrapData: false },
  );

  return unwrapPaginated<AdminOrderSummary>(response);
}, "admin-user-orders");
