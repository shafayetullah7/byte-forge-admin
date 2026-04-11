import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";

export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  status: string;
  nameEn: string;
  division: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopDetail {
  shop: {
    id: string;
    ownerId: string;
    slug: string;
    status: string;
    address: string | null;
    logoId: string | null;
    bannerId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  translations: Array<{
    id: string;
    shopId: string;
    locale: string;
    name: string;
    description: string;
    businessHours: string | null;
  }>;
  address: {
    id: string;
    shopId: string;
    country: string;
    division: string;
    district: string;
    street: string;
    postalCode: string;
    isVerified: boolean;
  } | null;
}

export interface VerificationHistory {
  id: string;
  shopId: string;
  action: string;
  previousStatus: string;
  newStatus: string;
  reason: string | null;
  createdAt: string;
}

/**
 * Fetch a list of shops (supports pagination, search, and filtering).
 */
export const getShops = query(async (params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params) {
    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
  }
  const qs = searchParams.toString();
  const url = qs ? `/admin/shops?${qs}` : "/admin/shops";
  return apiClient<{ data: Shop[]; pagination: any }>(url);
}, "shops-list");

/**
 * Fetch detail for a single shop.
 */
export const getShopDetail = query(async (id: string) => {
  return apiClient<ShopDetail>(`/admin/shops/${id}`);
}, "shop-detail");

/**
 * Approve a shop.
 */
export const approveShop = async (id: string) => {
  return apiClient(`/admin/shops/${id}/approve`, { method: "PATCH" });
};

/**
 * Reject a shop with reason.
 */
export const rejectShop = async (id: string, reason: string) => {
  return apiClient(`/admin/shops/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
};

/**
 * Suspend a shop with reason.
 */
export const suspendShop = async (id: string, reason: string) => {
  return apiClient(`/admin/shops/${id}/suspend`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
};

/**
 * Fetch verification history for a shop.
 */
export const getVerificationHistory = query(async (id: string) => {
  return apiClient<VerificationHistory[]>(`/admin/shops/${id}/history`);
}, "shop-history");
