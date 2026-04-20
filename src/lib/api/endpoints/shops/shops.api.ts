import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { PaginatedResponse, PaginationMeta } from "../../types";

/**
 * Shop status enum matching backend TShopStatus
 * @see byte-forge-auth/src/_db/drizzle/enum/shop.status.enum.ts
 */
export type ShopStatus = 
  | 'DRAFT'
  | 'PENDING_VERIFICATION'
  | 'APPROVED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'DELETED';

export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  status: ShopStatus;
  nameEn?: string;  // From English translation
  division?: string | null;  // From address translation
  city?: string | null;  // From address translation (district)
  logoId?: string | null;
  logoUrl?: string | null;  // Full URL to logo
  createdAt: string;
  updatedAt: string;
}

export interface ShopStats {
  totalShops: number;
  pendingShops: number;
  activeShops: number;
  suspendedShops: number;
  inactiveShops: number;
  pendingVerifications: number;
}

/**
 * Paginated response wrapped by ResponseService.paginated()
 * Matches: byte-forge-auth/src/common/modules/response/response.service.ts
 */
interface PaginatedStatsResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
  timestamp: string;
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
  verification: {
    id: string;
    shopId: string;
    tradeLicenseNumber: string | null;
    tradeLicenseDocument: string | null;
    tradeLicenseMedia: {
      url: string;
      fileName: string;
    } | null;
    tinNumber: string | null;
    tinDocument: string | null;
    tinMedia: {
      url: string;
      fileName: string;
    } | null;
    utilityBillDocument: string | null;
    utilityBillMedia: {
      url: string;
      fileName: string;
    } | null;
    status: string;
    verifiedAt: string | null;
    rejectionReason: string | null;
    adminNotes: string | null;
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
 * @see https://docs.solidjs.com/solid-start/guides/data-fetching
 */
export const getShops = query(
  async (params?: {
    status?: ShopStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Shop>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.status) searchParams.set("status", params.status);
      if (params.search) searchParams.set("search", params.search);
      if (params.page) searchParams.set("page", params.page.toString());
      if (params.limit) searchParams.set("limit", params.limit.toString());
    }
    const qs = searchParams.toString();
    const url = qs ? `/admin/shops?${qs}` : "/admin/shops";
    
    const response = await apiClient<PaginatedStatsResponse<Shop> | PaginatedResponse<Shop> | unknown>(url, { unwrapData: false });
    
    console.log('[Shops API] Raw response:', response);
    
    // Handle wrapped response from ResponseService.paginated()
    // Format: { success, message, data, meta, timestamp }
    if (response && typeof response === 'object' && 'data' in response && 'meta' in response && 'success' in response) {
      const paginatedResponse = response as PaginatedStatsResponse<Shop>;
      console.log('[Shops API] Returning paginated data:', paginatedResponse.data);
      return {
        data: paginatedResponse.data,
        meta: paginatedResponse.meta,
      };
    }
    
    // Handle already wrapped { data, meta } format (direct PaginatedResponse)
    if (response && typeof response === 'object' && 'data' in response && 'meta' in response) {
      console.log('[Shops API] Returning direct paginated data');
      return response as PaginatedResponse<Shop>;
    }
    
    // Unexpected response format - throw error to be caught by error boundary
    console.error('[Shops API] Unexpected response format:', response);
    throw new Error(
      `Shops API returned unexpected format. Expected PaginatedResponse but received ${typeof response}. ` +
      `This may indicate a backend API change or network issue.`
    );
  },
  "shops-list",
);

/**
 * Fetch detail for a single shop.
 */
export const getShopDetail = query(async (id: string) => {
  const response = await apiClient<ShopDetail>(`/admin/shops/${id}`);
  
  if (!response) {
    throw new Error(`Shop ${id} not found`);
  }
  
  return response;
}, "shop-detail");

/**
 * Approve a shop.
 */
export const approveShop = async (id: string) => {
  return apiClient(`/admin/shops/${id}/approve`, { method: "POST" });
};

/**
 * Reject a shop with reason.
 */
export const rejectShop = async (
  id: string,
  reason: string,
  adminNotes?: string,
) => {
  return apiClient(`/admin/shops/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason, adminNotes }),
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

/**
 * Fetch shop statistics (totals by status).
 */
export const getShopStats = query(async (): Promise<ShopStats> => {
  return apiClient<ShopStats>(`/admin/shops/stats`);
}, "shop-stats");
