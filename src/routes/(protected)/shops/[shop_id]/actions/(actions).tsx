import {
  createAsync,
  useParams,
  useAction,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, Suspense, createSignal } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Modal } from "~/components/ui/Modal";
import {
  getShopDetail,
  type ShopStatus,
} from "~/lib/api/endpoints/shops";
import {
  suspendShop,
  deactivateShop,
  reactivateShop,
} from "~/lib/api/endpoints/shops/shops.actions";

const MIN_REASON_LENGTH = 10;

const statusBanner: Record<
  ShopStatus,
  { title: string; description: string; variant: "success" | "warning" | "danger" | "neutral" }
> = {
  ACTIVE: {
    title: "Shop is active",
    description: "This shop is visible on the public marketplace.",
    variant: "success",
  },
  SUSPENDED: {
    title: "Shop is suspended",
    description: "This shop is hidden from customers. Reactivate to restore visibility.",
    variant: "danger",
  },
  INACTIVE: {
    title: "Shop is inactive",
    description: "This shop is deactivated. Reactivate to restore visibility.",
    variant: "neutral",
  },
  PENDING_VERIFICATION: {
    title: "Pending verification",
    description: "Complete verification before the shop can go live.",
    variant: "warning",
  },
  APPROVED: {
    title: "Shop approved",
    description: "Approved but not yet active on the marketplace.",
    variant: "warning",
  },
  REJECTED: {
    title: "Shop rejected",
    description: "Verification was rejected. Review the verification tab for details.",
    variant: "danger",
  },
  DRAFT: {
    title: "Draft shop",
    description: "The seller has not finished shop setup.",
    variant: "neutral",
  },
  DELETED: {
    title: "Deleted shop",
    description: "This shop has been deleted.",
    variant: "neutral",
  },
};

export const route: RouteDefinition = {
  preload: ({ params }) => getShopDetail(params.shop_id!),
};

export default function ActionsRoute() {
  const params = useParams();
  const shopId = () => params.shop_id!;

  const shop = createAsync(() => getShopDetail(shopId()));

  const suspendTrigger = useAction(suspendShop);
  const deactivateTrigger = useAction(deactivateShop);
  const reactivateTrigger = useAction(reactivateShop);

  const suspendSubmission = useSubmission(suspendShop);
  const deactivateSubmission = useSubmission(deactivateShop);
  const reactivateSubmission = useSubmission(reactivateShop);

  const [showSuspendModal, setShowSuspendModal] = createSignal(false);
  const [showDeactivateModal, setShowDeactivateModal] = createSignal(false);
  const [showReactivateModal, setShowReactivateModal] = createSignal(false);

  const [suspendReason, setSuspendReason] = createSignal("");
  const [deactivateReason, setDeactivateReason] = createSignal("");
  const [actionError, setActionError] = createSignal<string | null>(null);
  const [actionSuccess, setActionSuccess] = createSignal<string | null>(null);

  const validateReason = (reason: string) => {
    if (reason.trim().length < MIN_REASON_LENGTH) {
      return `Reason must be at least ${MIN_REASON_LENGTH} characters`;
    }
    return null;
  };

  const handleSuspend = async () => {
    const error = validateReason(suspendReason());
    if (error) {
      setActionError(error);
      return;
    }
    setActionError(null);
    try {
      await suspendTrigger({ id: shopId(), reason: suspendReason().trim() });
      setShowSuspendModal(false);
      setSuspendReason("");
      setActionSuccess("Shop suspended successfully.");
    } catch (err: unknown) {
      setActionError((err as Error)?.message ?? "Failed to suspend shop.");
    }
  };

  const handleDeactivate = async () => {
    const error = validateReason(deactivateReason());
    if (error) {
      setActionError(error);
      return;
    }
    setActionError(null);
    try {
      await deactivateTrigger({ id: shopId(), reason: deactivateReason().trim() });
      setShowDeactivateModal(false);
      setDeactivateReason("");
      setActionSuccess("Shop deactivated successfully.");
    } catch (err: unknown) {
      setActionError((err as Error)?.message ?? "Failed to deactivate shop.");
    }
  };

  const handleReactivate = async () => {
    setActionError(null);
    try {
      await reactivateTrigger(shopId());
      setShowReactivateModal(false);
      setActionSuccess("Shop reactivated successfully.");
    } catch (err: unknown) {
      setActionError((err as Error)?.message ?? "Failed to reactivate shop.");
    }
  };

  const banner = () => {
    const s = shop();
    if (!s) return null;
    return statusBanner[s.status] ?? statusBanner.DRAFT;
  };

  return (
    <Suspense fallback={<div class="text-sm text-slate-500">Loading shop actions...</div>}>
      <Show when={shop()}>
        {(shopData) => (
          <div class="space-y-6">
            <Show when={actionSuccess()}>
              <div class="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                {actionSuccess()}
              </div>
            </Show>

            <Show when={actionError()}>
              <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {actionError()}
              </div>
            </Show>

            <Show when={banner()}>
              {(b) => (
                <div
                  class="rounded-xl border p-6"
                  classList={{
                    "border-green-200 bg-green-50": b().variant === "success",
                    "border-amber-200 bg-amber-50": b().variant === "warning",
                    "border-red-200 bg-red-50": b().variant === "danger",
                    "border-slate-200 bg-slate-50": b().variant === "neutral",
                  }}
                >
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <h3 class="text-lg font-semibold text-slate-900">{b().title}</h3>
                      <p class="mt-1 text-sm text-slate-600">{b().description}</p>
                    </div>
                    <Badge
                      variant={
                        b().variant === "success"
                          ? "success"
                          : b().variant === "danger"
                            ? "danger"
                            : b().variant === "warning"
                              ? "warning"
                              : "neutral"
                      }
                    >
                      {shopData().status}
                    </Badge>
                  </div>
                </div>
              )}
            </Show>

            <div class="rounded-xl border border-slate-200 bg-white p-6">
              <h3 class="mb-4 text-lg font-semibold text-slate-900">Lifecycle actions</h3>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Show when={shopData().status === "ACTIVE"}>
                  <div class="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 class="text-sm font-semibold text-red-900">Suspend shop</h4>
                    <p class="mt-1 text-xs text-red-700">
                      Temporarily hide the shop from public discovery. Requires a reason.
                    </p>
                    <Button
                      variant="danger"
                      size="md"
                      class="mt-3 w-full"
                      disabled={suspendSubmission.pending}
                      onClick={() => {
                        setActionError(null);
                        setActionSuccess(null);
                        setShowSuspendModal(true);
                      }}
                    >
                      {suspendSubmission.pending ? "Suspending..." : "Suspend shop"}
                    </Button>
                  </div>

                  <div class="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 class="text-sm font-semibold text-slate-900">Deactivate shop</h4>
                    <p class="mt-1 text-xs text-slate-600">
                      Deactivate the shop and remove it from the public marketplace.
                    </p>
                    <Button
                      variant="outline"
                      size="md"
                      class="mt-3 w-full"
                      disabled={deactivateSubmission.pending}
                      onClick={() => {
                        setActionError(null);
                        setActionSuccess(null);
                        setShowDeactivateModal(true);
                      }}
                    >
                      {deactivateSubmission.pending ? "Deactivating..." : "Deactivate shop"}
                    </Button>
                  </div>
                </Show>

                <Show when={shopData().status === "SUSPENDED" || shopData().status === "INACTIVE"}>
                  <div class="rounded-lg border border-green-200 bg-green-50 p-4 md:col-span-2">
                    <h4 class="text-sm font-semibold text-green-900">Reactivate shop</h4>
                    <p class="mt-1 text-xs text-green-700">
                      Restore the shop to active status so it can appear on the marketplace again.
                    </p>
                    <Button
                      variant="primary"
                      size="md"
                      class="mt-3 w-full md:w-auto"
                      disabled={reactivateSubmission.pending}
                      onClick={() => {
                        setActionError(null);
                        setActionSuccess(null);
                        setShowReactivateModal(true);
                      }}
                    >
                      {reactivateSubmission.pending ? "Reactivating..." : "Reactivate shop"}
                    </Button>
                  </div>
                </Show>

                <Show
                  when={
                    shopData().status !== "ACTIVE" &&
                    shopData().status !== "SUSPENDED" &&
                    shopData().status !== "INACTIVE"
                  }
                >
                  <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                    <p class="text-sm text-slate-600">
                      No lifecycle actions are available for shops in{" "}
                      <span class="font-medium">{shopData().status}</span> status. Use the
                      verification tab for approval workflows.
                    </p>
                  </div>
                </Show>
              </div>
            </div>

            <Modal
              show={showSuspendModal()}
              onClose={() => setShowSuspendModal(false)}
              title="Suspend shop"
              footer={
                <div class="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSuspendModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    disabled={suspendSubmission.pending}
                    onClick={handleSuspend}
                  >
                    {suspendSubmission.pending ? "Suspending..." : "Confirm suspend"}
                  </Button>
                </div>
              }
            >
              <p class="mb-3 text-sm text-slate-600">
                The shop will be hidden from `/shops` and public storefront URLs will return 404.
              </p>
              <Input
                label="Reason"
                value={suspendReason()}
                onInput={(e) => setSuspendReason(e.currentTarget.value)}
                placeholder="Explain why this shop is being suspended"
              />
            </Modal>

            <Modal
              show={showDeactivateModal()}
              onClose={() => setShowDeactivateModal(false)}
              title="Deactivate shop"
              footer={
                <div class="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowDeactivateModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    disabled={deactivateSubmission.pending}
                    onClick={handleDeactivate}
                  >
                    {deactivateSubmission.pending ? "Deactivating..." : "Confirm deactivate"}
                  </Button>
                </div>
              }
            >
              <p class="mb-3 text-sm text-slate-600">
                Deactivation hides the shop from public surfaces. Reactivation is available later.
              </p>
              <Input
                label="Reason"
                value={deactivateReason()}
                onInput={(e) => setDeactivateReason(e.currentTarget.value)}
                placeholder="Explain why this shop is being deactivated"
              />
            </Modal>

            <Modal
              show={showReactivateModal()}
              onClose={() => setShowReactivateModal(false)}
              title="Reactivate shop"
              footer={
                <div class="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowReactivateModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    disabled={reactivateSubmission.pending}
                    onClick={handleReactivate}
                  >
                    {reactivateSubmission.pending ? "Reactivating..." : "Confirm reactivate"}
                  </Button>
                </div>
              }
            >
              <p class="text-sm text-slate-600">
                This will set the shop status to ACTIVE. Verification status is not automatically
                restored.
              </p>
            </Modal>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
