"use action";

import { action, revalidate } from "@solidjs/router";
import { apiClient } from "../../api-client";
import type { AdminReview } from "./reviews.types";

function revalidateReviewCaches(reviewId?: string) {
  revalidate("admin-reviews");
  if (reviewId) {
    revalidate(["admin-review-detail", reviewId]);
  } else {
    revalidate("admin-review-detail");
  }
}

export const featureAdminReview = action(async (reviewId: string) => {
  await apiClient<AdminReview>(`/admin/reviews/${reviewId}/feature`, {
    method: "PATCH",
  });
  revalidateReviewCaches(reviewId);
}, "feature-admin-review");

export const unfeatureAdminReview = action(async (reviewId: string) => {
  await apiClient<AdminReview>(`/admin/reviews/${reviewId}/unfeature`, {
    method: "PATCH",
  });
  revalidateReviewCaches(reviewId);
}, "unfeature-admin-review");

export const removeAdminReview = action(
  async (input: { reviewId: string; reason: string }) => {
    await apiClient<AdminReview>(`/admin/reviews/${input.reviewId}/remove`, {
      method: "PATCH",
      body: JSON.stringify({ reason: input.reason }),
    });
    revalidateReviewCaches(input.reviewId);
  },
  "remove-admin-review",
);

export const restoreAdminReview = action(async (reviewId: string) => {
  await apiClient<AdminReview>(`/admin/reviews/${reviewId}/restore`, {
    method: "PATCH",
  });
  revalidateReviewCaches(reviewId);
}, "restore-admin-review");

export const updateAdminReviewReportStatus = action(
  async (input: { reportId: string; status: "OPEN" | "RESOLVED" | "DISMISSED" }) => {
    await apiClient(`/admin/reviews/reports/${input.reportId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: input.status }),
    });
    revalidateReviewCaches();
  },
  "update-admin-review-report-status",
);
