import { useParams, A, createAsync, type RouteDefinition } from "@solidjs/router";
import { Suspense, createSignal } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Modal } from "~/components/ui/Modal";
import { Badge } from "~/components/ui/Badge";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import {
  getShopDetail,
  approveShop,
  rejectShop,
  suspendShop,
  getVerificationHistory,
} from "~/lib/api/endpoints/shops";
import { ShopStatusBadge } from "~/components/shops/ShopList";
import { VerificationHistory } from "~/components/shops/VerificationHistory";

export const route: RouteDefinition = {
  preload: (args) => getShopDetail(args.params.shop_id!),
};

export default function ShopDetailPage() {
  const params = useParams();
  const shopData = createAsync(() => getShopDetail(params.shop_id!));
  const historyData = createAsync(() => getVerificationHistory(params.shop_id!));

  const [showRejectModal, setShowRejectModal] = createSignal(false);
  const [showSuspendModal, setShowSuspendModal] = createSignal(false);
  const [reason, setReason] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this shop?")) return;

    setLoading(true);
    try {
      if (!params.shop_id) return;
      await approveShop(params.shop_id);
      alert("Shop approved successfully");
      // Reload page to refresh data
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to approve shop: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (reason().length < 10) {
      alert("Please provide a detailed rejection reason (min 10 characters)");
      return;
    }

    setLoading(true);
    try {
      if (!params.shop_id) return;
      await rejectShop(params.shop_id, reason());
      alert("Shop rejected");
      setShowRejectModal(false);
      setReason("");
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to reject shop: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (reason().length < 10) {
      alert("Please provide a detailed suspension reason (min 10 characters)");
      return;
    }

    setLoading(true);
    try {
      if (!params.shop_id) return;
      await suspendShop(params.shop_id, reason());
      alert("Shop suspended");
      setShowSuspendModal(false);
      setReason("");
      window.location.reload();
    } catch (error: any) {
      alert(`Failed to suspend shop: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="px-6 py-8 mx-auto max-w-[1200px]">
      {/* Header */}
      <div class="flex items-center justify-between mb-8">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <A href="/shops" class="text-sm text-slate-500 hover:text-slate-700">
              ← Back to Shops
            </A>
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Shop Details</h1>
        </div>
        <div class="flex gap-3">
          <A href="/">
            <Button variant="outline" size="md">View Frontend</Button>
          </A>
        </div>
      </div>

      <SafeErrorBoundary
        fallback={(err, reset) => (
          <InlineErrorFallback error={err} reset={reset} label="shop details" />
        )}
      >
        <Suspense fallback={<div class="h-96 bg-slate-50 rounded-2xl animate-pulse" />}>
          {(() => {
            const shop = shopData();
            const history = historyData();

            if (!shop) return <div>Shop not found</div>;

            const englishTranslation = shop.translations?.find((t) => t.locale === "en");
            const bengaliTranslation = shop.translations?.find((t) => t.locale === "bn");

            return (
              <div class="space-y-6">
                {/* Status Banner */}
                <div class="bg-white rounded-2xl border border-slate-200 p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h2 class="text-xl font-bold text-slate-900">
                        {englishTranslation?.name || "Unnamed Shop"}
                      </h2>
                      <p class="text-sm text-slate-500 mt-1">{shop.shop.slug}</p>
                    </div>
                    <ShopStatusBadge status={shop.shop.status} />
                  </div>
                </div>

                {/* Action Buttons */}
                {shop.shop.status === "PENDING_VERIFICATION" && (
                  <div class="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4">
                      Review Actions
                    </h3>
                    <div class="flex gap-3">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleApprove}
                        isLoading={loading()}
                      >
                        Approve Shop
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setShowRejectModal(true)}
                        disabled={loading()}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="danger"
                        size="md"
                        onClick={() => setShowSuspendModal(true)}
                        disabled={loading()}
                      >
                        Suspend
                      </Button>
                    </div>
                  </div>
                )}

                {shop.shop.status === "APPROVED" && (
                  <div class="bg-white rounded-2xl border border-slate-200 p-6">
                    <div class="flex gap-3">
                      <Button
                        variant="danger"
                        size="md"
                        onClick={() => setShowSuspendModal(true)}
                        disabled={loading()}
                      >
                        Suspend Shop
                      </Button>
                    </div>
                  </div>
                )}

                {/* Shop Information */}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* English */}
                  <Card title="English (EN)">
                    <div class="space-y-3">
                      <div>
                        <label class="text-xs font-semibold text-slate-500 uppercase">
                          Shop Name
                        </label>
                        <p class="text-slate-900">{englishTranslation?.name}</p>
                      </div>
                      <div>
                        <label class="text-xs font-semibold text-slate-500 uppercase">
                          Description
                        </label>
                        <p class="text-slate-700">{englishTranslation?.description}</p>
                      </div>
                      <div>
                        <label class="text-xs font-semibold text-slate-500 uppercase">
                          Business Hours
                        </label>
                        <p class="text-slate-700">
                          {englishTranslation?.businessHours || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Bengali */}
                  <Card title="Bengali (BN)">
                    <div class="space-y-3">
                      <div>
                        <label class="text-xs font-semibold text-slate-500 uppercase">
                          Shop Name
                        </label>
                        <p class="text-slate-900">{bengaliTranslation?.name}</p>
                      </div>
                      <div>
                        <label class="text-xs font-semibold text-slate-500 uppercase">
                          Description
                        </label>
                        <p class="text-slate-700">{bengaliTranslation?.description}</p>
                      </div>
                      <div>
                        <label class="text-xs font-semibold text-slate-500 uppercase">
                          Business Hours
                        </label>
                        <p class="text-slate-700">
                          {bengaliTranslation?.businessHours || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Address */}
                {shop.address && (
                  <Card title="Address">
                    <div class="space-y-2">
                      <p class="text-slate-700">{shop.address.street}</p>
                      <p class="text-slate-700">
                        {shop.address.district}, {shop.address.division}{" "}
                        {shop.address.postalCode}
                      </p>
                      <p class="text-slate-700">{shop.address.country}</p>
                      <div class="mt-2">
                        <Badge variant={shop.address.isVerified ? "success" : "neutral"}>
                          {shop.address.isVerified ? "Verified Address" : "Not Verified"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Verification Documents */}
                {shop.verification && (
                  <Card title="Verification Documents">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Trade License */}
                      <div class="space-y-3">
                        <label class="text-xs font-semibold text-slate-500 uppercase block">
                          Trade License
                        </label>
                        <div class="space-y-1">
                          <p class="text-sm font-medium text-slate-900 truncate">
                            {shop.verification.tradeLicenseNumber || "N/A"}
                          </p>
                          {shop.verification.tradeLicenseMedia ? (
                            <a
                              href={shop.verification.tradeLicenseMedia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium"
                            >
                              <span>View Document</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          ) : (
                            <span class="text-xs text-slate-400 italic">No document uploaded</span>
                          )}
                        </div>
                      </div>

                      {/* TIN */}
                      <div class="space-y-3">
                        <label class="text-xs font-semibold text-slate-500 uppercase block">
                          TIN Number
                        </label>
                        <div class="space-y-1">
                          <p class="text-sm font-medium text-slate-900 truncate">
                            {shop.verification.tinNumber || "N/A"}
                          </p>
                          {shop.verification.tinMedia ? (
                            <a
                              href={shop.verification.tinMedia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium"
                            >
                              <span>View Document</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          ) : (
                            <span class="text-xs text-slate-400 italic">No document uploaded</span>
                          )}
                        </div>
                      </div>

                      {/* Utility Bill */}
                      <div class="space-y-3">
                        <label class="text-xs font-semibold text-slate-500 uppercase block">
                          Utility Bill
                        </label>
                        <div class="space-y-1">
                          <p class="text-sm font-medium text-slate-900">Document</p>
                          {shop.verification.utilityBillMedia ? (
                            <a
                              href={shop.verification.utilityBillMedia.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="inline-flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium"
                            >
                              <span>View Document</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                            </a>
                          ) : (
                            <span class="text-xs text-slate-400 italic">No document uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Verification History */}
                <Card title="Verification History">
                  <VerificationHistory history={history || []} />
                </Card>

                {/* Metadata */}
                <Card title="Shop Information">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label class="text-xs font-semibold text-slate-500 uppercase">
                        Shop ID
                      </label>
                      <p class="text-slate-900 font-mono">{shop.shop.id}</p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-slate-500 uppercase">
                        Owner ID
                      </label>
                      <p class="text-slate-900 font-mono">{shop.shop.ownerId}</p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-slate-500 uppercase">
                        Created
                      </label>
                      <p class="text-slate-700">
                        {new Date(shop.shop.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label class="text-xs font-semibold text-slate-500 uppercase">
                        Updated
                      </label>
                      <p class="text-slate-700">
                        {new Date(shop.shop.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })()}
        </Suspense>
      </SafeErrorBoundary>

      {/* Reject Modal */}
      <Modal
        show={showRejectModal()}
        onClose={() => {
          setShowRejectModal(false);
          setReason("");
        }}
        title="Reject Shop"
      >
        <div class="space-y-4">
          <p class="text-sm text-slate-600">
            Please provide a detailed reason for rejecting this shop. The seller will be
            notified.
          </p>
          <textarea
            class="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500"
            placeholder="Enter rejection reason (minimum 10 characters)..."
            value={reason()}
            onInput={(e) => setReason(e.currentTarget.value)}
          />
          <div class="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setShowRejectModal(false);
                setReason("");
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleReject} isLoading={loading()}>
              Reject Shop
            </Button>
          </div>
        </div>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        show={showSuspendModal()}
        onClose={() => {
          setShowSuspendModal(false);
          setReason("");
        }}
        title="Suspend Shop"
      >
        <div class="space-y-4">
          <p class="text-sm text-slate-600">
            Please provide a detailed reason for suspending this shop. The seller will be
            notified and the shop will be hidden from customers.
          </p>
          <textarea
            class="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500"
            placeholder="Enter suspension reason (minimum 10 characters)..."
            value={reason()}
            onInput={(e) => setReason(e.currentTarget.value)}
          />
          <div class="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setShowSuspendModal(false);
                setReason("");
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleSuspend} isLoading={loading()}>
              Suspend Shop
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
