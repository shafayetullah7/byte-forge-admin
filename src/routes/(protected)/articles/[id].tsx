import {
  A,
  createAsync,
  useAction,
  useParams,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import { createSignal, For, Show, Suspense } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Modal } from "~/components/ui/Modal";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";
import { PageHeader } from "~/components/layout/PageHeader";
import { PageShell } from "~/components/layout/PageShell";
import { ArrowLeftIcon, DocumentIcon } from "~/components/icons";
import {
  approveAdminArticle,
  getAdminArticle,
  rejectAdminArticle,
  setAdminArticleEditorsPick,
  type ModerationStatus,
} from "~/lib/api/endpoints/articles";

export const route: RouteDefinition = {
  preload: ({ params }) => getAdminArticle(params.id!),
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const statusBadge = (status: ModerationStatus) => {
  if (status === "PENDING") return "warning";
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  return "neutral";
};

export default function ArticleDetailPage() {
  const params = useParams();
  const article = createAsync(() => getAdminArticle(params.id!));

  const approveAction = useAction(approveAdminArticle);
  const rejectAction = useAction(rejectAdminArticle);
  const editorsPickAction = useAction(setAdminArticleEditorsPick);
  const approveSubmission = useSubmission(approveAdminArticle);
  const rejectSubmission = useSubmission(rejectAdminArticle);
  const editorsPickSubmission = useSubmission(setAdminArticleEditorsPick);

  const [showApproveModal, setShowApproveModal] = createSignal(false);
  const [showRejectModal, setShowRejectModal] = createSignal(false);
  const [rejectReason, setRejectReason] = createSignal("");
  const [actionError, setActionError] = createSignal<string | null>(null);
  const [actionMessage, setActionMessage] = createSignal<string | null>(null);
  const [rejectError, setRejectError] = createSignal<string | null>(null);

  const actionLoading = () =>
    approveSubmission.pending || rejectSubmission.pending || editorsPickSubmission.pending;

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveAction(params.id!);
      setActionMessage("Article approved successfully");
      setShowApproveModal(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to approve article");
    }
  };

  const handleReject = async () => {
    const reason = rejectReason().trim();
    if (reason.length < 10) {
      setRejectError("Rejection reason must be at least 10 characters");
      return;
    }

    setRejectError(null);
    setActionError(null);
    try {
      await rejectAction({ articleId: params.id!, reason });
      setActionMessage("Article rejected successfully");
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      setRejectError(error instanceof Error ? error.message : "Failed to reject article");
    }
  };

  const handleEditorsPickToggle = async () => {
    const current = article();
    if (!current) return;

    setActionError(null);
    try {
      await editorsPickAction({
        articleId: params.id!,
        isEditorsPick: !current.isEditorsPick,
      });
      setActionMessage(
        current.isEditorsPick
          ? "Article removed from editor's pick"
          : "Article marked as editor's pick",
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Failed to update editor's pick status",
      );
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Suspense fallback={<div class="text-sm text-slate-500">Loading article...</div>}>
          <Show when={article()}>
            {(data) => (
              <>
                <Title>{data().title || "Article"} | ByteForge Admin</Title>
                <Meta name="description" content="Review article details and moderate approval." />

                <div class="mb-4">
                  <A
                    href="/articles"
                    class="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeftIcon class="w-4 h-4" />
                    Back to articles
                  </A>
                </div>

                <PageHeader
                  title={data().title || "Untitled article"}
                  description={`/${data().slug} · Updated ${formatDateTime(data().updatedAt)}`}
                  icon={DocumentIcon}
                />

                <Show when={actionMessage()}>
                  {(value) => (
                    <div class="mb-4 rounded-xl border border-primary-green-200 bg-primary-green-50 px-4 py-3 text-sm text-primary-green-800">
                      {value()}
                    </div>
                  )}
                </Show>

                <Show when={actionError()}>
                  {(value) => (
                    <div class="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                      {value()}
                    </div>
                  )}
                </Show>

                <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <p class="text-xs font-semibold uppercase text-slate-500">Status</p>
                    <div class="mt-2">
                      <Badge variant={statusBadge(data().moderationStatus) as any}>
                        {data().moderationStatus}
                      </Badge>
                    </div>
                    <Show when={data().rejectedReason}>
                      <p class="mt-2 text-sm text-rose-700">{data().rejectedReason}</p>
                    </Show>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <p class="text-xs font-semibold uppercase text-slate-500">Category</p>
                    <p class="mt-2 text-sm text-slate-900">{data().category ?? "—"}</p>
                    <Show when={data().readMinutes}>
                      <p class="mt-1 text-sm text-slate-500">{data().readMinutes} min read</p>
                    </Show>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <p class="text-xs font-semibold uppercase text-slate-500">Editor's Pick</p>
                    <p class="mt-2 font-medium text-slate-900">
                      {data().isEditorsPick ? "Yes" : "No"}
                    </p>
                    <Show when={data().editorsPickAt}>
                      <p class="text-sm text-slate-500">
                        Since {formatDateTime(data().editorsPickAt!)}
                      </p>
                    </Show>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <p class="text-xs font-semibold uppercase text-slate-500">Shop</p>
                    <p class="mt-2 font-medium text-slate-900">{data().shop?.name ?? "Unknown"}</p>
                    <Show when={data().shop}>
                      {(shop) => (
                        <A
                          href={`/shops/${shop().id}`}
                          class="text-sm text-primary-green-700 hover:underline"
                        >
                          View shop
                        </A>
                      )}
                    </Show>
                  </div>
                </div>

                <Show when={data().coverImage}>
                  {(cover) => (
                    <div class="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img
                        src={cover().url}
                        alt="Article cover"
                        class="max-h-64 w-full object-cover"
                      />
                    </div>
                  )}
                </Show>

                <div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 class="text-sm font-semibold uppercase text-slate-500">English</h2>
                    <p class="mt-2 font-semibold text-slate-900">{data().translations.en.title}</p>
                    <Show when={data().translations.en.excerpt}>
                      <p class="mt-2 text-sm text-slate-600 italic">{data().translations.en.excerpt}</p>
                    </Show>
                    <p class="mt-3 text-sm text-slate-600 whitespace-pre-wrap">
                      {data().translations.en.body ?? "No body content provided."}
                    </p>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 class="text-sm font-semibold uppercase text-slate-500">Bengali</h2>
                    <p class="mt-2 font-semibold text-slate-900">{data().translations.bn.title}</p>
                    <Show when={data().translations.bn.excerpt}>
                      <p class="mt-2 text-sm text-slate-600 italic">{data().translations.bn.excerpt}</p>
                    </Show>
                    <p class="mt-3 text-sm text-slate-600 whitespace-pre-wrap">
                      {data().translations.bn.body ?? "No body content provided."}
                    </p>
                  </div>
                </div>

                <div class="flex flex-wrap gap-3">
                  <Show when={data().moderationStatus === "PENDING"}>
                    <Button
                      variant="primary"
                      isLoading={actionLoading()}
                      onClick={() => setShowApproveModal(true)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      isLoading={actionLoading()}
                      onClick={() => {
                        setRejectError(null);
                        setRejectReason("");
                        setShowRejectModal(true);
                      }}
                    >
                      Reject
                    </Button>
                  </Show>

                  <Show when={data().moderationStatus === "APPROVED"}>
                    <Button
                      variant="secondary"
                      isLoading={actionLoading()}
                      onClick={handleEditorsPickToggle}
                    >
                      {data().isEditorsPick ? "Remove Editor's Pick" : "Mark Editor's Pick"}
                    </Button>
                  </Show>
                </div>

                <Modal
                  show={showApproveModal()}
                  onClose={() => setShowApproveModal(false)}
                  title="Approve article"
                  footer={
                    <div class="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
                        Cancel
                      </Button>
                      <Button variant="primary" isLoading={actionLoading()} onClick={handleApprove}>
                        Confirm approval
                      </Button>
                    </div>
                  }
                >
                  <p class="text-sm text-slate-600">
                    This article will be published once approved. Continue?
                  </p>
                </Modal>

                <Modal
                  show={showRejectModal()}
                  onClose={() => setShowRejectModal(false)}
                  title="Reject article"
                  footer={
                    <div class="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                        Cancel
                      </Button>
                      <Button variant="danger" isLoading={actionLoading()} onClick={handleReject}>
                        Confirm rejection
                      </Button>
                    </div>
                  }
                >
                  <div class="space-y-3">
                    <p class="text-sm text-slate-600">
                      Provide a reason for the seller (minimum 10 characters).
                    </p>
                    <Input
                      label="Rejection reason"
                      value={rejectReason()}
                      onInput={(event) => setRejectReason(event.currentTarget.value)}
                      placeholder="Explain why this article cannot be approved"
                    />
                    <Show when={rejectError()}>
                      <p class="text-sm text-rose-600">{rejectError()}</p>
                    </Show>
                  </div>
                </Modal>
              </>
            )}
          </Show>
        </Suspense>
      </PageShell>
    </SafeErrorBoundary>
  );
}
