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
    if (filter.minRating !== undefined) params.minRating = filter.minRating;
    if (filter.maxRating !== undefined) params.maxRating = filter.maxRating;
    if (filter.reportedOnly !== undefined) params.reportedOnly = filter.reportedOnly;
    if (filter.featuredOnly !== undefined) params.featuredOnly = filter.featuredOnly;
    if (filter.removedOnly !== undefined) params.removedOnly = filter.removedOnly;
  }

  return apiClient<AdminReviewListResponse>(BASE_PATH, {
    params,
    unwrapData: false,
  });
}, "admin-reviews");

export const getAdminReview = query(async (reviewId: string) => {
  return apiClient<AdminReview>(`${BASE_PATH}/${reviewId}`);
}, "admin-review-detail");

export const featureAdminReview = async (reviewId: string) => {
  await apiClient<AdminReview>(`${BASE_PATH}/${reviewId}/feature`, {
    method: "PATCH",
  });
  revalidate(getAdminReviews.keyFor());
  revalidate(getAdminReview.keyFor(reviewId));
};

export const unfeatureAdminReview = async (reviewId: string) => {
  await apiClient<AdminReview>(`${BASE_PATH}/${reviewId}/unfeature`, {
    method: "PATCH",
  });
  revalidate(getAdminReviews.keyFor());
  revalidate(getAdminReview.keyFor(reviewId));
};

export const removeAdminReview = async (reviewId: string, reason: string) => {
  await apiClient<AdminReview>(`${BASE_PATH}/${reviewId}/remove`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
  revalidate(getAdminReviews.keyFor());
  revalidate(getAdminReview.keyFor(reviewId));
};

export const restoreAdminReview = async (reviewId: string) => {
  await apiClient<AdminReview>(`${BASE_PATH}/${reviewId}/restore`, {
    method: "PATCH",
  });
  revalidate(getAdminReviews.keyFor());
  revalidate(getAdminReview.keyFor(reviewId));
};

export const updateAdminReviewReportStatus = async (
  reportId: string,
  status: "OPEN" | "RESOLVED" | "DISMISSED"
) => {
  await apiClient(`${BASE_PATH}/reports/${reportId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  revalidate(getAdminReviews.keyFor());
};
