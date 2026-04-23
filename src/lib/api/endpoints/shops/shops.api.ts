import { query, action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { PaginatedResponse, PaginatedResult, PaginationMeta } from "../../types";

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

export type ShopVerificationStatus = 
  | 'PENDING'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED';

export type { PaginatedResult };

export interface ShopOwner {
  firstName: string;
  lastName: string;
  userName: string;
  avatar: string | null;
}

export interface ShopVerification {
  status: ShopVerificationStatus;
  verifiedAt: string | null;
  rejectionReason: string | null;
}

export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  status: ShopStatus;
  isVerified: boolean;
  nameEn?: string;
  division?: string | null;
  city?: string | null;
  logoId?: string | null;
  logoUrl?: string | null;
  owner: ShopOwner | null;
  verification: ShopVerification | null;
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
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "PENDING_VERIFICATION" | "APPROVED" | "ACTIVE" | "INACTIVE" | "REJECTED" | "SUSPENDED" | "DELETED";
  isVerified: boolean;
  logo: string | null;
  banner: string | null;
  verificationStatus: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | null;
  owner: {
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string | null;
  } | null;
  createdAt: string;
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
    verificationStatus?: ShopVerificationStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResult<Shop>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.status) searchParams.set("status", params.status);
      if (params.verificationStatus) searchParams.set("verificationStatus", params.verificationStatus);
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
export const approveShop = action(async (id: string): Promise<void> => {
  await apiClient(`/admin/shops/${id}/approve`, { method: "POST" });
  revalidate("shop-verification");
  revalidate("shop-detail");
});

/**
 * Reject a shop with reason.
 */
export const rejectShop = action(async (
  id: string,
  reason: string,
  adminNotes?: string,
): Promise<void> => {
  await apiClient(`/admin/shops/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason, adminNotes }),
  });
  revalidate("shop-verification");
  revalidate("shop-detail");
});

/**
 * Suspend a shop with reason.
 */
export const suspendShop = action(async (id: string, reason: string): Promise<void> => {
  await apiClient(`/admin/shops/${id}/suspend`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  revalidate("shop-verification");
  revalidate("shop-detail");
  revalidate("shops-list");
});

/**
 * Document with URL for download.
 */
export interface VerificationDocument {
  id: string;
  url: string;
  name: string;
}

/**
 * Verification history entry.
 */
export interface VerificationHistoryEntry {
  id: string;
  action: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  reason?: string | null;
  timestamp: string;
}

/**
 * Complete shop verification details.
 */
export interface ShopVerificationDetails {
  shopId: string;
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  verifiedAt: string | null;
  
  // Documents - IDs
  tradeLicenseDocumentId: string | null;
  tinDocumentId: string | null;
  utilityBillDocumentId: string | null;
  
  // Documents - Full media objects for preview
  tradeLicenseNumber: string | null;
  tradeLicenseDocument: VerificationDocument | null;
  tinNumber: string | null;
  tinDocument: VerificationDocument | null;
  utilityBillDocument: VerificationDocument | null;
  
  // Admin
  adminNotes: string | null;
  rejectionReason: string | null;
  
  // History
  history: VerificationHistoryEntry[];
}

/**
 * Fetch complete verification details for a shop.
 */
export const getShopVerification = query(async (id: string) => {
  return apiClient<ShopVerificationDetails>(`/admin/shops/${id}/verification`);
}, "shop-verification");

/**
 * Fetch verification history for a shop (deprecated - use getShopVerification instead).
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
