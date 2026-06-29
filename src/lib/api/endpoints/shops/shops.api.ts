import { query } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { PaginatedResponse, PaginatedResult, PaginationMeta } from "../../types";

/**
 * Shop status enum matching backend TShopStatus
 * @see byte-forge-backend/src/_db/drizzle/enum/shop.status.enum.ts
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
 * Matches: byte-forge-backend/src/common/modules/response/response.service.ts
 */
interface PaginatedStatsResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
  timestamp: string;
}

export interface ShopTranslationDetail {
  locale: string;
  name: string;
  description: string | null;
  businessHours: string | null;
  tagline: string | null;
  about: string | null;
  sellerStory: string | null;
  brandMission: string | null;
}

export interface ShopContactDetail {
  businessEmail: string | null;
  phone: string | null;
  alternativePhone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  facebook: string | null;
  instagram: string | null;
  x: string | null;
}

export interface ShopAddressTranslationDetail {
  locale: string;
  country: string | null;
  division: string | null;
  district: string | null;
  street: string | null;
}

export interface ShopAddressDetail {
  postalCode: string;
  latitude: string | null;
  longitude: string | null;
  googleMapsLink: string | null;
  isVerified: boolean;
  translations: ShopAddressTranslationDetail[];
}

export interface ShopDetail {
  id: string;
  name: string;
  slug: string;
  status: ShopStatus;
  isVerified: boolean;
  logo: string | null;
  banner: string | null;
  verificationStatus: ShopVerificationStatus | null;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string | null;
    email: string | null;
    emailVerified: boolean;
    memberSince: string;
  } | null;
  translations: ShopTranslationDetail[];
  contact: ShopContactDetail | null;
  address: ShopAddressDetail | null;
  createdAt: string;
  updatedAt: string;
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

    // Handle wrapped response from ResponseService.paginated()
    // Format: { success, message, data, meta, timestamp }
    if (response && typeof response === 'object' && 'data' in response && 'meta' in response && 'success' in response) {
      const paginatedResponse = response as PaginatedStatsResponse<Shop>;
      return {
        data: paginatedResponse.data,
        meta: paginatedResponse.meta,
      };
    }
    
    // Handle already wrapped { data, meta } format (direct PaginatedResponse)
    if (response && typeof response === 'object' && 'data' in response && 'meta' in response) {
      return response as PaginatedResponse<Shop>;
    }

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
 * Fetch shop statistics (totals by status).
 */
export const getShopStats = query(async (): Promise<ShopStats> => {
  return apiClient<ShopStats>(`/admin/shops/stats`);
}, "shop-stats");
