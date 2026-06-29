import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { PaginatedResponse, PaginatedResult, PaginationMeta } from "../../types";
import type {
  AdminProductDetail,
  AdminProductFilter,
  AdminProductSummary,
} from "./products.types";

const BASE_PATH = "/admin/products";

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

  throw new Error("Products API returned unexpected paginated format");
}

export const getAdminProducts = query(async (filter?: AdminProductFilter) => {
  const params: Record<string, string | number | undefined> = {};
  if (filter) {
    if (filter.page !== undefined) params.page = filter.page;
    if (filter.limit !== undefined) params.limit = filter.limit;
    if (filter.shopId) params.shopId = filter.shopId;
    if (filter.status) params.status = filter.status;
    if (filter.productType) params.productType = filter.productType;
    if (filter.search) params.search = filter.search;
    if (filter.sortBy) params.sortBy = filter.sortBy;
    if (filter.sortOrder) params.sortOrder = filter.sortOrder;
  }

  const response = await apiClient<PaginatedResponse<AdminProductSummary>>(BASE_PATH, {
    params,
    unwrapData: false,
  });

  return unwrapPaginated<AdminProductSummary>(response);
}, "admin-products");

export const getAdminProduct = query(async (productId: string) => {
  return apiClient<AdminProductDetail>(`${BASE_PATH}/${productId}`);
}, "admin-product-detail");
