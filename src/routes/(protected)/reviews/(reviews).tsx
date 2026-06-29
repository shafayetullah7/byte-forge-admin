import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Meta, Title } from "@solidjs/meta";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { ClipboardDocumentListIcon } from "~/components/icons";
import {
  featureAdminReview,
  getAdminReviews,
  removeAdminReview,
  restoreAdminReview,
  unfeatureAdminReview,
  updateAdminReviewReportStatus,
  type AdminReview,
  type ReviewStatus,
} from "~/lib/api/endpoints/reviews";

export const route: RouteDefinition = {
  preload: () => getAdminReviews({ limit: 30 }),
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusBadge = (review: AdminReview) => {
  if (review.isRemovedByAdmin) return "danger";
  if (review.isFeatured) return "success";
  return review.status === "PENDING" ? "warning" : "neutral";
};

export default function ReviewsModerationPage() {
  const [refreshTick, setRefreshTick] = createSignal(0);
  const [statusFilter, setStatusFilter] = createSignal<"" | ReviewStatus>("");
  const [reportedOnly, setReportedOnly] = createSignal(false);
  const [featuredOnly, setFeaturedOnly] = createSignal(false);
  const [removedOnly, setRemovedOnly] = createSignal(false);
  const [actionId, setActionId] = createSignal<string | null>(null);
  const [message, setMessage] = createSignal<string | null>(null);

  const reviewsData = createAsync(() => {
    refreshTick();
    return getAdminReviews({
      status: statusFilter() || undefined,
      reportedOnly: reportedOnly() || undefined,
      featuredOnly: featuredOnly() || undefined,
      removedOnly: removedOnly() || undefined,
      limit: 50,
    });
  });

  const reviews = () => reviewsData()?.data ?? [];
  const metrics = createMemo(() => {
    const rows = reviews();
    return {
      total: reviewsData()?.meta.total ?? rows.length,
      reported: rows.filter((item) => (item.reports?.length ?? 0) > 0).length,
      featured: rows.filter((item) => item.isFeatured).length,
      removed: rows.filter((item) => item.isRemovedByAdmin).length,
    };
  });

  const runAction = async (review: AdminReview, type: string) => {
    setActionId(review.id);
    setMessage(null);
    try {
      if (type === "feature") await featureAdminReview(review.id);
      if (type === "unfeature") await unfeatureAdminReview(review.id);
      if (type === "remove")
        await removeAdminReview({
          reviewId: review.id,
          reason: "Removed by admin policy review",
        });
      if (type === "restore") await restoreAdminReview(review.id);

      if (type === "resolve-report" && review.reports?.[0]) {
        await updateAdminReviewReportStatus({
          reportId: review.reports[0].id,
          status: "RESOLVED",
        });
      }

      setMessage("Review moderation updated");
      setRefreshTick((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Moderation failed");
    } finally {
      setActionId(null);
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Reviews | ByteForge Admin</Title>
        <Meta
          name="description"
          content="Feature, remove, and triage reported marketplace reviews."
        />

        <PageHeader
          title="Review Governance"
          description="Triage seller reports, feature trusted reviews for landing pages, and remove policy-violating reviews."
          icon={ClipboardDocumentListIcon}
        />

        <Show when={message()}>
          {(value) => (
            <div class="mb-4 rounded-xl border border-primary-green-200 bg-primary-green-50 px-4 py-3 text-sm text-primary-green-800">
              {value()}
            </div>
          )}
        </Show>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Total</p>
            <p class="text-2xl font-bold text-slate-900">{metrics().total}</p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Reported</p>
            <p class="text-2xl font-bold text-amber-700">{metrics().reported}</p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Featured</p>
            <p class="text-2xl font-bold text-primary-green-700">{metrics().featured}</p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Removed</p>
            <p class="text-2xl font-bold text-rose-700">{metrics().removed}</p>
          </Card>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <For each={["", "PENDING", "APPROVED", "REJECTED"] as const}>
            {(status) => (
              <button
                type="button"
                class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  statusFilter() === status
                    ? "bg-slate-800 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status || "ALL"}
              </button>
            )}
          </For>
          <button
            type="button"
            class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              reportedOnly()
                ? "bg-amber-600 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
            onClick={() => setReportedOnly((value) => !value)}
          >
            Reported
          </button>
          <button
            type="button"
            class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              featuredOnly()
                ? "bg-primary-green-700 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
            onClick={() => setFeaturedOnly((value) => !value)}
          >
            Featured
          </button>
          <button
            type="button"
            class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              removedOnly()
                ? "bg-rose-600 text-white"
                : "bg-white border border-slate-200 text-slate-600"
            }`}
            onClick={() => setRemovedOnly((value) => !value)}
          >
            Removed
          </button>
        </div>

        <Suspense fallback={<Card class="h-64 animate-pulse bg-slate-50 border-slate-200 shadow-sm" />}>
          <div class="space-y-4">
            <For
              each={reviews()}
              fallback={
                <Card class="py-16 text-center">
                  <p class="font-semibold text-slate-700">No reviews found</p>
                  <p class="text-sm text-slate-500 mt-1">
                    Adjust filters to inspect more items.
                  </p>
                </Card>
              }
            >
              {(review) => (
                <Card class="p-5 border-slate-200 shadow-sm">
                  <div class="flex flex-col lg:flex-row gap-4">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={statusBadge(review) as any}>
                          {review.isRemovedByAdmin
                            ? "REMOVED"
                            : review.isFeatured
                              ? "FEATURED"
                              : review.status}
                        </Badge>
                        <span class="text-sm font-semibold text-slate-900">
                          {review.rating} / 5 stars
                        </span>
                        <Show when={(review.reports?.length ?? 0) > 0}>
                          <span class="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            {review.reports?.length} report(s)
                          </span>
                        </Show>
                      </div>
                      <h3 class="font-semibold text-slate-900">
                        {review.title ?? "Untitled review"}
                      </h3>
                      <p class="text-sm text-slate-600 mt-1">
                        {review.comment ?? "No written comment provided."}
                      </p>
                      <p class="text-xs text-slate-400 mt-2">
                        Submitted {formatDate(review.createdAt)} · Buyer{" "}
                        {review.customer?.name ?? "Unknown"} · Product{" "}
                        {review.product?.name ?? "Unknown"}
                      </p>
                      <Show when={review.reports?.[0]}>
                        {(report) => (
                          <div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                            <p class="font-semibold">Latest seller report</p>
                            <p>Reason: {report().reason}</p>
                            <Show when={report().details}>
                              <p>Details: {report().details}</p>
                            </Show>
                          </div>
                        )}
                      </Show>
                    </div>
                    <div class="flex gap-2 lg:flex-col">
                      <Button
                        size="sm"
                        variant="secondary"
                        isLoading={actionId() === review.id}
                        onClick={() =>
                          runAction(review, review.isFeatured ? "unfeature" : "feature")
                        }
                      >
                        {review.isFeatured ? "Unfeature" : "Feature"}
                      </Button>
                      <Button
                        size="sm"
                        variant={review.isRemovedByAdmin ? "secondary" : "danger"}
                        isLoading={actionId() === review.id}
                        onClick={() =>
                          runAction(review, review.isRemovedByAdmin ? "restore" : "remove")
                        }
                      >
                        {review.isRemovedByAdmin ? "Restore" : "Remove"}
                      </Button>
                      <Show when={(review.reports?.length ?? 0) > 0}>
                        <Button
                          size="sm"
                          variant="outline"
                          isLoading={actionId() === review.id}
                          onClick={() => runAction(review, "resolve-report")}
                        >
                          Resolve Report
                        </Button>
                      </Show>
                    </div>
                  </div>
                </Card>
              )}
            </For>
          </div>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
