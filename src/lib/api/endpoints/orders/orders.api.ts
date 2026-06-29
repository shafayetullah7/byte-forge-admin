import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { PaginatedResponse, PaginatedResult, PaginationMeta } from "../../types";
import type {
  AdminOrderDetail,
  AdminOrderFilter,
  AdminOrderStats,
  AdminOrderStatsFilter,
  AdminOrderSummary,
} from "./orders.types";

const BASE_PATH = "/admin/orders";

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

  throw new Error("Orders API returned unexpected paginated format");
}

export const getAdminOrders = query(async (filter?: AdminOrderFilter) => {
  const params: Record<string, string | number | undefined> = {};
  if (filter) {
    if (filter.page !== undefined) params.page = filter.page;
    if (filter.limit !== undefined) params.limit = filter.limit;
    if (filter.shopId) params.shopId = filter.shopId;
    if (filter.userId) params.userId = filter.userId;
    if (filter.status) params.status = filter.status;
    if (filter.paymentStatus) params.paymentStatus = filter.paymentStatus;
    if (filter.search) params.search = filter.search;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter.dateTo) params.dateTo = filter.dateTo;
    if (filter.sortBy) params.sortBy = filter.sortBy;
    if (filter.sortOrder) params.sortOrder = filter.sortOrder;
  }

  const response = await apiClient<PaginatedResponse<AdminOrderSummary>>(BASE_PATH, {
    params,
    unwrapData: false,
  });

  return unwrapPaginated<AdminOrderSummary>(response);
}, "admin-orders");

export const getAdminOrder = query(async (orderId: string) => {
  return apiClient<AdminOrderDetail>(`${BASE_PATH}/${orderId}`);
}, "admin-order-detail");

export const getAdminOrderStats = query(async (filter?: AdminOrderStatsFilter) => {
  const params: Record<string, string | undefined> = {};
  if (filter?.shopId) params.shopId = filter.shopId;
  if (filter?.userId) params.userId = filter.userId;

  return apiClient<AdminOrderStats>(`${BASE_PATH}/stats`, { params });
}, "admin-order-stats");
