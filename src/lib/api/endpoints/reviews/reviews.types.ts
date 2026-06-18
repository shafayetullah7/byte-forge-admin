export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminReview {
  id: string;
  userId: string;
  orderItemId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    userName: string;
  } | null;
  product: {
    id: string;
    slug: string;
    name: string;
    thumbnail: { id: string; url: string } | null;
    shop: {
      id: string;
      slug: string;
      name: string;
    } | null;
  } | null;
  order: {
    id: string;
    orderNumber: string;
    status: string;
  } | null;
}

export interface AdminReviewListResponse {
  data: AdminReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AdminReviewFilter {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  rating?: number;
}
