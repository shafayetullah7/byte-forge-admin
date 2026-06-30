export type ModerationStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export interface AdminArticleShopSummary {
  id: string;
  slug: string;
  name: string;
}

export interface AdminArticleListItem {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  moderationStatus: ModerationStatus;
  publishedAt: string | null;
  isEditorsPick: boolean;
  shop: AdminArticleShopSummary | null;
  createdAt: string;
}

export interface AdminArticleDetail {
  id: string;
  shopId: string;
  slug: string;
  category: string | null;
  readMinutes: number | null;
  coverImage: { id: string; url: string } | null;
  moderationStatus: ModerationStatus;
  rejectedReason: string | null;
  moderatedAt: string | null;
  publishedAt: string | null;
  isEditorsPick: boolean;
  editorsPickAt: string | null;
  title: string;
  translations: {
    en: { title: string; excerpt: string | null; body: string | null };
    bn: { title: string; excerpt: string | null; body: string | null };
  };
  shop: AdminArticleShopSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminArticleListResponse {
  data: AdminArticleListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminArticleFilter {
  page?: number;
  limit?: number;
  search?: string;
  moderationStatus?: ModerationStatus;
}
