export type ModerationStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export interface AdminCampaignShopSummary {
  id: string;
  slug: string;
  name: string;
}

export interface AdminCampaignListItem {
  id: string;
  slug: string;
  type: string;
  title: string;
  moderationStatus: ModerationStatus;
  startDate: string;
  endDate: string;
  shop: AdminCampaignShopSummary | null;
  createdAt: string;
}

export interface AdminCampaignProduct {
  id: string;
  slug: string;
  name: string;
}

export interface AdminCampaignDetail {
  id: string;
  shopId: string;
  slug: string;
  type: string;
  banner: { id: string; url: string } | null;
  discountPercent: number | null;
  startDate: string;
  endDate: string;
  moderationStatus: ModerationStatus;
  rejectedReason: string | null;
  moderatedAt: string | null;
  title: string;
  translations: {
    en: { title: string; description: string | null };
    bn: { title: string; description: string | null };
  };
  products: AdminCampaignProduct[];
  shop: AdminCampaignShopSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCampaignListResponse {
  data: AdminCampaignListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminCampaignFilter {
  page?: number;
  limit?: number;
  search?: string;
  moderationStatus?: ModerationStatus;
}
