import { query, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type {
  AdminReview,
  AdminReviewFilter,
  AdminReviewListResponse,
} from "./reviews.types";

const BASE_PATH = "/admin/reviews";

export const getAdminReviews = query(async (filter?: AdminReviewFilter) => {
  const params: Record<string, string | number | boolean | undefined> = {};
  if (filter) {
    if (filter.page !== undefined) params.page = filter.page;
    if (filter.limit !== undefined) params.limit = filter.limit;
    if (filter.status !== undefined) params.status = filter.status;
    if (filter.rating !== undefined) params.rating = filter.rating;
  }

  return apiClient<AdminReviewListResponse>(BASE_PATH, {
    params,
    unwrapData: false,
  });
}, "admin-reviews");

export const getAdminReview = query(async (reviewId: string) => {
  return apiClient<AdminReview>(`${BASE_PATH}/${reviewId}`);
}, "admin-review-detail");

export const approveAdminReview = async (reviewId: string) => {
  await apiClient<AdminReview>(`${BASE_PATH}/${reviewId}/approve`, {
    method: "PATCH",
  });
  revalidate(getAdminReviews.keyFor());
  revalidate(getAdminReview.keyFor(reviewId));
};

export const rejectAdminReview = async (reviewId: string) => {
  await apiClient<AdminReview>(`${BASE_PATH}/${reviewId}/reject`, {
    method: "PATCH",
  });
  revalidate(getAdminReviews.keyFor());
  revalidate(getAdminReview.keyFor(reviewId));
};
