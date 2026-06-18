import { createMemo, createSignal, For, Show, Suspense } from "solid-js";
import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Title, Meta } from "@solidjs/meta";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { ClipboardDocumentListIcon } from "~/components/icons";
import {
  approveAdminReview,
  getAdminReviews,
  rejectAdminReview,
  type AdminReview,
  type ReviewStatus,
} from "~/lib/api/endpoints/reviews";

export const route: RouteDefinition = {
  preload: () => getAdminReviews({ status: "PENDING" }),
};

const statusVariant = (status: ReviewStatus) => {
  switch (status) {
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    default:
      return "warning";
  }
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function ReviewCard(props: {
  review: AdminReview;
  actionId: string | null;
  onApprove: (review: AdminReview) => void;
  onReject: (review: AdminReview) => void;
}) {
  const pending = () => props.actionId === props.review.id;

  return (
    <Card class="p-5 border-slate-200 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={statusVariant(props.review.status)}>
              {props.review.status}
            </Badge>
            <span class="text-sm font-semibold text-slate-900">
              {props.review.rating} / 5 stars
            </span>
            <Show when={props.review.isVerifiedPurchase}>
              <span class="text-xs font-medium text-primary-green-700 bg-primary-green-50 px-2 py-0.5 rounded-full">
                Verified purchase
              </span>
            </Show>
          </div>

          <h3 class="font-semibold text-slate-900">
            {props.review.title ?? "Untitled review"}
          </h3>
          <p class="text-sm text-slate-600 mt-1">
            {props.review.comment ?? "No written comment provided."}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs text-slate-500">
            <div>
              <span class="font-semibold text-slate-700">Buyer:</span>{" "}
              {props.review.customer?.name ?? "Unknown"}
            </div>
            <div>
              <span class="font-semibold text-slate-700">Product:</span>{" "}
              {props.review.product?.name ?? "Unknown"}
            </div>
            <div>
              <span class="font-semibold text-slate-700">Order:</span>{" "}
              {props.review.order?.orderNumber ?? "Unknown"}
            </div>
          </div>

          <p class="text-xs text-slate-400 mt-3">
            Submitted {formatDate(props.review.createdAt)}
          </p>
        </div>

        <Show when={props.review.status === "PENDING"}>
          <div class="flex gap-2 lg:flex-col">
            <Button
              size="sm"
              variant="primary"
              isLoading={pending()}
              onClick={() => props.onApprove(props.review)}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              isLoading={pending()}
              onClick={() => props.onReject(props.review)}
            >
              Reject
            </Button>
          </div>
        </Show>
      </div>
    </Card>
  );
}

export default function ReviewsModerationPage() {
  const [statusFilter, setStatusFilter] = createSignal<"" | ReviewStatus>(
    "PENDING",
  );
  const [refreshTick, setRefreshTick] = createSignal(0);
  const [actionId, setActionId] = createSignal<string | null>(null);
  const [message, setMessage] = createSignal<string | null>(null);

  const reviewsData = createAsync(() => {
    refreshTick();
    return getAdminReviews({
      status: statusFilter() || undefined,
      limit: 50,
    });
  });

  const reviews = () => reviewsData()?.data ?? [];
  const metrics = createMemo(() => {
    const rows = reviews();
    return {
      total: reviewsData()?.meta.total ?? rows.length,
      pending: rows.filter((review) => review.status === "PENDING").length,
      approved: rows.filter((review) => review.status === "APPROVED").length,
      rejected: rows.filter((review) => review.status === "REJECTED").length,
    };
  });

  const runModeration = async (
    review: AdminReview,
    action: "approve" | "reject",
  ) => {
    setActionId(review.id);
    setMessage(null);
    try {
      if (action === "approve") {
        await approveAdminReview(review.id);
        setMessage("Review approved successfully");
      } else {
        await rejectAdminReview(review.id);
        setMessage("Review rejected successfully");
      }
      setRefreshTick((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Review update failed");
    } finally {
      setActionId(null);
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Title>Reviews | ByteForge Admin</Title>
        <Meta name="description" content="Moderate marketplace reviews" />

        <PageHeader
          title="Review Moderation"
          description="Approve or reject verified-purchase reviews before they appear publicly."
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
            <p class="text-xs font-semibold text-slate-500 uppercase">Pending</p>
            <p class="text-2xl font-bold text-amber-700">{metrics().pending}</p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Approved</p>
            <p class="text-2xl font-bold text-primary-green-700">
              {metrics().approved}
            </p>
          </Card>
          <Card class="p-4">
            <p class="text-xs font-semibold text-slate-500 uppercase">Rejected</p>
            <p class="text-2xl font-bold text-rose-700">{metrics().rejected}</p>
          </Card>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-6">
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
        </div>

        <Suspense
          fallback={
            <Card class="h-64 animate-pulse bg-slate-50 border-slate-200 shadow-sm" />
          }
        >
          <div class="space-y-4">
            <For
              each={reviews()}
              fallback={
                <Card class="py-16 text-center">
                  <p class="font-semibold text-slate-700">No reviews found</p>
                  <p class="text-sm text-slate-500 mt-1">
                    Try a different moderation filter.
                  </p>
                </Card>
              }
            >
              {(review) => (
                <ReviewCard
                  review={review}
                  actionId={actionId()}
                  onApprove={(row) => runModeration(row, "approve")}
                  onReject={(row) => runModeration(row, "reject")}
                />
              )}
            </For>
          </div>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
