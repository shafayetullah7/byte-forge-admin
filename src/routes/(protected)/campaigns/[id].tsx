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
import { ArrowLeftIcon, ArrowTrendingUpIcon } from "~/components/icons";
import {
  approveAdminCampaign,
  getAdminCampaign,
  rejectAdminCampaign,
  type ModerationStatus,
} from "~/lib/api/endpoints/campaigns";

export const route: RouteDefinition = {
  preload: ({ params }) => getAdminCampaign(params.id!),
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

export default function CampaignDetailPage() {
  const params = useParams();
  const campaign = createAsync(() => getAdminCampaign(params.id!));

  const approveAction = useAction(approveAdminCampaign);
  const rejectAction = useAction(rejectAdminCampaign);
  const approveSubmission = useSubmission(approveAdminCampaign);
  const rejectSubmission = useSubmission(rejectAdminCampaign);

  const [showApproveModal, setShowApproveModal] = createSignal(false);
  const [showRejectModal, setShowRejectModal] = createSignal(false);
  const [rejectReason, setRejectReason] = createSignal("");
  const [actionError, setActionError] = createSignal<string | null>(null);
  const [actionMessage, setActionMessage] = createSignal<string | null>(null);
  const [rejectError, setRejectError] = createSignal<string | null>(null);

  const actionLoading = () => approveSubmission.pending || rejectSubmission.pending;

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveAction(params.id!);
      setActionMessage("Campaign approved successfully");
      setShowApproveModal(false);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to approve campaign");
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
      await rejectAction({ campaignId: params.id!, reason });
      setActionMessage("Campaign rejected successfully");
      setShowRejectModal(false);
      setRejectReason("");
    } catch (error) {
      setRejectError(error instanceof Error ? error.message : "Failed to reject campaign");
    }
  };

  return (
    <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
      <PageShell>
        <Suspense fallback={<div class="text-sm text-slate-500">Loading campaign...</div>}>
          <Show when={campaign()}>
            {(data) => (
              <>
                <Title>{data().title || "Campaign"} | ByteForge Admin</Title>
                <Meta name="description" content="Review campaign details and moderate approval." />

                <div class="mb-4">
                  <A
                    href="/campaigns"
                    class="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeftIcon class="w-4 h-4" />
                    Back to campaigns
                  </A>
                </div>

                <PageHeader
                  title={data().title || "Untitled campaign"}
                  description={`/${data().slug} · ${data().type} · Updated ${formatDateTime(data().updatedAt)}`}
                  icon={ArrowTrendingUpIcon}
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

                <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
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
                    <p class="text-xs font-semibold uppercase text-slate-500">Schedule</p>
                    <p class="mt-2 text-sm text-slate-900">
                      {formatDateTime(data().startDate)} – {formatDateTime(data().endDate)}
                    </p>
                    <Show when={data().discountPercent !== null}>
                      <p class="mt-1 text-sm text-slate-500">{data().discountPercent}% discount</p>
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

                <Show when={data().banner}>
                  {(banner) => (
                    <div class="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img
                        src={banner().url}
                        alt="Campaign banner"
                        class="max-h-64 w-full object-cover"
                      />
                    </div>
                  )}
                </Show>

                <div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 class="text-sm font-semibold uppercase text-slate-500">English</h2>
                    <p class="mt-2 font-semibold text-slate-900">{data().translations.en.title}</p>
                    <p class="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                      {data().translations.en.description ?? "No description provided."}
                    </p>
                  </div>
                  <div class="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 class="text-sm font-semibold uppercase text-slate-500">Bengali</h2>
                    <p class="mt-2 font-semibold text-slate-900">{data().translations.bn.title}</p>
                    <p class="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                      {data().translations.bn.description ?? "No description provided."}
                    </p>
                  </div>
                </div>

                <Show when={data().products.length > 0}>
                  <div class="mb-6 rounded-xl border border-slate-200 bg-white p-5">
                    <h2 class="text-sm font-semibold uppercase text-slate-500 mb-3">
                      Linked products ({data().products.length})
                    </h2>
                    <ul class="space-y-2">
                      <For each={data().products}>
                        {(product) => (
                          <li class="flex items-center justify-between text-sm">
                            <span class="font-medium text-slate-900">{product.name || product.slug}</span>
                            <A
                              href={`/products/${product.id}`}
                              class="text-primary-green-700 hover:underline"
                            >
                              View
                            </A>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </Show>

                <Show when={data().moderationStatus === "PENDING"}>
                  <div class="flex flex-wrap gap-3">
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
                  </div>
                </Show>

                <Modal
                  show={showApproveModal()}
                  onClose={() => setShowApproveModal(false)}
                  title="Approve campaign"
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
                    This campaign will be visible to customers once approved. Continue?
                  </p>
                </Modal>

                <Modal
                  show={showRejectModal()}
                  onClose={() => setShowRejectModal(false)}
                  title="Reject campaign"
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
                      placeholder="Explain why this campaign cannot be approved"
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
