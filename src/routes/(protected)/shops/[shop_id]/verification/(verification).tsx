import { createAsync, useParams, type RouteDefinition, useAction, useSubmission } from "@solidjs/router";
import { Suspense, Show, ErrorBoundary, createSignal, createMemo } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Input } from "~/components/ui/Input";
import { getShopVerification, approveShop, rejectShop } from "~/lib/api/endpoints/shops";
import { 
  ExclamationCircleIcon, 
  ShieldCheckIcon, 
  DocumentIcon,
  ArrowUpRightIcon
} from "~/components/icons";

// Helper function for file type detection
function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const lowerName = fileName.toLowerCase();
  return imageExtensions.some(ext => lowerName.endsWith(ext));
}

export const route: RouteDefinition = {
  preload: ({ params }) => {
    return getShopVerification(params.shop_id!);
  },
};

const statusConfig: Record<string, { variant: "warning" | "success" | "danger" | "neutral"; label: string; title: string; description: string }> = {
  PENDING: { 
    variant: "warning", 
    label: "PENDING",
    title: "Under Review",
    description: "This shop is pending verification. Review the documents below.",
  },
  REVIEWING: { 
    variant: "warning", 
    label: "REVIEWING",
    title: "In Review",
    description: "This shop is being reviewed. Continue evaluation.",
  },
  APPROVED: { 
    variant: "success", 
    label: "APPROVED",
    title: "Verified",
    description: "This shop has been verified and approved.",
  },
  REJECTED: { 
    variant: "danger", 
    label: "REJECTED",
    title: "Rejected",
    description: "This shop verification was rejected.",
  },
};

export default function VerificationRoute() {
  const params = useParams();
  const verificationData = createAsync(() => getShopVerification(params.shop_id!));
  
  // Actions
  const approveAction = useAction(approveShop);
  const rejectAction = useAction(rejectShop);
  
  // Submission states
  const approveSubmission = useSubmission(approveShop);
  const rejectSubmission = useSubmission(rejectShop);
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = createSignal(false);
  const [showRejectModal, setShowRejectModal] = createSignal(false);
  
  // Action result states
  const [approveError, setApproveError] = createSignal<string | null>(null);
  const [rejectError, setRejectError] = createSignal<string | null>(null);
  const [approveSuccess, setApproveSuccess] = createSignal(false);
  const [rejectSuccess, setRejectSuccess] = createSignal(false);
  
  // Reject form state
  const [rejectReason, setRejectReason] = createSignal("");
  const [adminNotes, setAdminNotes] = createSignal("");
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  
  const handleApproveClick = () => {
    setApproveError(null);
    setApproveSuccess(false);
    setShowApproveModal(true);
  };
  
  const handleApproveConfirm = async () => {
    setApproveError(null);
    try {
      await approveAction(params.shop_id!);
      setApproveSuccess(true);
      setTimeout(() => {
        setShowApproveModal(false);
        setApproveSuccess(false);
      }, 1500);
    } catch (error: any) {
      setApproveError(error?.message || "Failed to approve shop. Please try again.");
    }
  };
  
  const handleRejectClick = () => {
    setRejectError(null);
    setRejectSuccess(false);
    setRejectReason("");
    setAdminNotes("");
    setErrors({});
    setShowRejectModal(true);
  };
  
  const validateRejectForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!rejectReason().trim()) {
      newErrors.reason = "Rejection reason is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleRejectConfirm = async () => {
    if (!validateRejectForm()) return;
    
    setRejectError(null);
    try {
      await rejectAction(params.shop_id!, rejectReason().trim(), adminNotes().trim() || undefined);
      setRejectSuccess(true);
      setTimeout(() => {
        setShowRejectModal(false);
        setRejectSuccess(false);
        setRejectReason("");
        setAdminNotes("");
      }, 1500);
    } catch (error: any) {
      setRejectError(error?.message || "Failed to reject shop. Please try again.");
    }
  };

  return (
    <div class="space-y-6">
      <ErrorBoundary
        fallback={(error) => (
          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <ExclamationCircleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 class="text-lg font-semibold text-red-900">Failed to Load Verification Data</h3>
                <p class="text-sm text-red-700 mt-1">
                  {error?.message?.includes("shop_verification_history") 
                    ? "The verification history table is not set up in the database yet. Please run database migrations."
                    : "Unable to fetch verification details. Please try again later."}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}
      >
        <Suspense fallback={<div class="p-6">Loading verification details...</div>}>
          <Show when={verificationData()}>
          {(data) => {
            const config = createMemo(() => statusConfig[data().status]);
            
            return (
              <>
                {/* Status Banner */}
                <div class={`rounded-xl p-6 border ${
                  config().variant === "warning" ? "bg-amber-50 border-amber-200" :
                  config().variant === "success" ? "bg-green-50 border-green-200" :
                  "bg-red-50 border-red-200"
                }`}>
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-4">
                      <div class={`p-3 rounded-xl ${
                        config().variant === "warning" ? "bg-amber-100" :
                        config().variant === "success" ? "bg-green-100" :
                        "bg-red-100"
                      }`}>
                        <ShieldCheckIcon class={`w-6 h-6 ${
                          config().variant === "warning" ? "text-amber-600" :
                          config().variant === "success" ? "text-green-600" :
                          "text-red-600"
                        }`} />
                      </div>
                      <div>
                        <h3 class={`text-lg font-semibold ${
                          config().variant === "warning" ? "text-amber-900" :
                          config().variant === "success" ? "text-green-900" :
                          "text-red-900"
                        }`}>{config().title}</h3>
                        <p class={`text-sm ${
                          config().variant === "warning" ? "text-amber-700" :
                          config().variant === "success" ? "text-green-700" :
                          "text-red-700"
                        } mt-1`}>{config().description}</p>
                        <div class="flex items-center gap-2 mt-3">
                          <Badge variant={config().variant}>{data().status}</Badge>
                          <span class={`text-xs ${
                            config().variant === "warning" ? "text-amber-600" :
                            config().variant === "success" ? "text-green-600" :
                            "text-red-600"
                          }`}>
                            Submitted on {new Date(data().submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {data().rejectionReason && (
                          <div class="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl">
                            <div class="flex items-start gap-2 mb-2">
                              <ExclamationCircleIcon class="w-4 h-4 text-red-700 flex-shrink-0 mt-0.5" />
                              <p class="text-sm font-bold text-red-900">Rejection Reason</p>
                            </div>
                            <p class="text-sm text-red-800 ml-6 leading-relaxed">{data().rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Actions */}
                {(data().status === "PENDING" || data().status === "REVIEWING") && (
                  <div class="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 class="text-lg font-semibold text-slate-900 mb-4">Verification Actions</h3>
                    <div class="flex flex-wrap gap-3">
                      <Button 
                        variant="primary" 
                        size="md" 
                        onClick={handleApproveClick}
                        disabled={approveSubmission.pending}
                      >
                        {approveSubmission.pending ? "Approving..." : "Approve Shop"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="md" 
                        onClick={handleRejectClick}
                        disabled={rejectSubmission.pending}
                      >
                        {rejectSubmission.pending ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                <div class="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">Verification Documents</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Trade License */}
                    <div class="border border-slate-200 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-semibold text-slate-700">Trade License</h4>
                        <Badge variant={data().tradeLicenseDocument ? "success" : "danger"} size="sm">
                          {data().tradeLicenseDocument ? "Uploaded" : "Missing"}
                        </Badge>
                      </div>
                      {data().tradeLicenseNumber && (
                        <div class="mb-3">
                          <label class="text-xs text-slate-500">Number/ID</label>
                          <p class="text-sm text-slate-900 font-mono">{data().tradeLicenseNumber}</p>
                        </div>
                      )}
                      {data().tradeLicenseDocument ? (
                        <div class="space-y-3">
                          {/* File Preview Card */}
                          <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            {/* File Icon/Preview */}
                            <div class="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                              {isImageFile(data().tradeLicenseDocument!.name) ? (
                                <img 
                                  src={data().tradeLicenseDocument!.url} 
                                  alt="Preview" 
                                  class="w-full h-full object-cover"
                                />
                              ) : (
                                <DocumentIcon class="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            
                            {/* File Info */}
                            <div class="flex-1 min-w-0">
                              <p class="text-xs font-medium text-slate-700 truncate">
                                {data().tradeLicenseDocument!.name}
                              </p>
                              <p class="text-xs text-slate-500 mt-0.5">
                                Click to view full document
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <a 
                            href={data().tradeLicenseDocument!.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-green-600 bg-primary-green-50 hover:bg-primary-green-100 rounded-lg transition-colors"
                          >
                            <ArrowUpRightIcon class="w-4 h-4" />
                            View Full Document
                          </a>
                        </div>
                      ) : (
                        <p class="text-xs text-slate-400 italic">No document uploaded</p>
                      )}
                    </div>

                    {/* TIN Certificate */}
                    <div class="border border-slate-200 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-semibold text-slate-700">TIN Certificate</h4>
                        <Badge variant={data().tinDocument ? "success" : "danger"} size="sm">
                          {data().tinDocument ? "Uploaded" : "Missing"}
                        </Badge>
                      </div>
                      {data().tinNumber && (
                        <div class="mb-3">
                          <label class="text-xs text-slate-500">Number/ID</label>
                          <p class="text-sm text-slate-900 font-mono">{data().tinNumber}</p>
                        </div>
                      )}
                      {data().tinDocument ? (
                        <div class="space-y-3">
                          {/* File Preview Card */}
                          <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            {/* File Icon/Preview */}
                            <div class="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                              {isImageFile(data().tinDocument!.name) ? (
                                <img 
                                  src={data().tinDocument!.url} 
                                  alt="Preview" 
                                  class="w-full h-full object-cover"
                                />
                              ) : (
                                <DocumentIcon class="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            
                            {/* File Info */}
                            <div class="flex-1 min-w-0">
                              <p class="text-xs font-medium text-slate-700 truncate">
                                {data().tinDocument!.name}
                              </p>
                              <p class="text-xs text-slate-500 mt-0.5">
                                Click to view full document
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <a 
                            href={data().tinDocument!.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-green-600 bg-primary-green-50 hover:bg-primary-green-100 rounded-lg transition-colors"
                          >
                            <ArrowUpRightIcon class="w-4 h-4" />
                            View Full Document
                          </a>
                        </div>
                      ) : (
                        <p class="text-xs text-slate-400 italic">No document uploaded</p>
                      )}
                    </div>

                    {/* Utility Bill */}
                    <div class="border border-slate-200 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-3">
                        <h4 class="text-sm font-semibold text-slate-700">Utility Bill</h4>
                        <Badge variant={data().utilityBillDocument ? "success" : "danger"} size="sm">
                          {data().utilityBillDocument ? "Uploaded" : "Missing"}
                        </Badge>
                      </div>
                      {data().utilityBillDocument ? (
                        <div class="space-y-3">
                          {/* File Preview Card */}
                          <div class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            {/* File Icon/Preview */}
                            <div class="w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                              {isImageFile(data().utilityBillDocument!.name) ? (
                                <img 
                                  src={data().utilityBillDocument!.url} 
                                  alt="Preview" 
                                  class="w-full h-full object-cover"
                                />
                              ) : (
                                <DocumentIcon class="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            
                            {/* File Info */}
                            <div class="flex-1 min-w-0">
                              <p class="text-xs font-medium text-slate-700 truncate">
                                {data().utilityBillDocument!.name}
                              </p>
                              <p class="text-xs text-slate-500 mt-0.5">
                                Click to view full document
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <a 
                            href={data().utilityBillDocument!.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            class="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-green-600 bg-primary-green-50 hover:bg-primary-green-100 rounded-lg transition-colors"
                          >
                            <ArrowUpRightIcon class="w-4 h-4" />
                            View Full Document
                          </a>
                        </div>
                      ) : (
                        <p class="text-xs text-slate-400 italic">No document uploaded</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div class="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">Admin Notes</h3>
                  <textarea
                    class="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 text-sm"
                    placeholder="Add notes about this verification..."
                    value={data().adminNotes || ""}
                    readonly
                  />
                  <p class="text-xs text-slate-500 mt-2">Notes are read-only. Update via approval/rejection flow.</p>
                </div>

                {/* Verification History */}
                <div class="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">Verification History</h3>
                  <Show when={data().history.length > 0} fallback={
                    <p class="text-sm text-slate-500 italic">No history available</p>
                  }>
                    <div class="space-y-3">
                      {data().history.map((entry) => (
                        <div class="flex items-start gap-3">
                          <div class={`w-2 h-2 rounded-full mt-2 ${
                            entry.action === "APPROVED" ? "bg-green-500" :
                            entry.action === "REJECTED" ? "bg-red-500" :
                            "bg-slate-300"
                          }`} />
                          <div class="flex-1">
                            <p class="text-sm text-slate-900">
                              {entry.action === "SUBMITTED" && "Shop submitted for verification"}
                              {entry.action === "APPROVED" && "Shop approved"}
                              {entry.action === "REJECTED" && `Shop rejected: ${entry.reason || "No reason provided"}`}
                              {entry.action === "REVIEWING" && "Admin started review"}
                              {!["SUBMITTED", "APPROVED", "REJECTED", "REVIEWING"].includes(entry.action) && entry.action}
                            </p>
                            <p class="text-xs text-slate-500">
                              {new Date(entry.timestamp).toLocaleString("en-US", { 
                                month: "short", 
                                day: "numeric", 
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Show>
                </div>

                {/* Approve Modal */}
                <Modal
                  show={showApproveModal()}
                  onClose={() => setShowApproveModal(false)}
                  title="Approve Shop"
                  footer={
                    <Show when={!approveSuccess()} fallback={
                      <div class="flex items-center justify-center w-full">
                        <span class="text-green-600 font-semibold">✓ Shop approved successfully!</span>
                      </div>
                    }>
                      <div class="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => setShowApproveModal(false)}
                          disabled={approveSubmission.pending}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleApproveConfirm}
                          disabled={approveSubmission.pending || approveError() !== null}
                        >
                          {approveSubmission.pending ? "Approving..." : "Confirm Approval"}
                        </Button>
                      </div>
                    </Show>
                  }
                >
                  <div class="space-y-4">
                    {/* Error Alert */}
                    <Show when={approveError()}>
                      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div class="flex items-start gap-3">
                          <ExclamationCircleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p class="text-sm text-red-800">{approveError()}</p>
                        </div>
                      </div>
                    </Show>
                    
                    <Show when={!approveError()}>
                      <p class="text-sm text-slate-600">
                        Are you sure you want to approve this shop? This action will:
                      </p>
                      <ul class="list-disc list-inside space-y-2 text-sm text-slate-600 ml-2">
                        <li>Change the shop status to <strong class="text-green-600">ACTIVE</strong></li>
                        <li>Mark verification status as <strong class="text-green-600">APPROVED</strong></li>
                        <li>Mark shop as <strong class="text-green-600">Verified</strong></li>
                        <li>Allow the shop to operate on the platform</li>
                      </ul>
                      <div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p class="text-xs text-amber-800">
                          <strong class="font-semibold">Note:</strong> This action cannot be undone. If you need to suspend the shop later, you'll need to use the suspension workflow.
                        </p>
                      </div>
                    </Show>
                  </div>
                </Modal>

                {/* Reject Modal */}
                <Modal
                  show={showRejectModal()}
                  onClose={() => setShowRejectModal(false)}
                  title="Reject Shop Verification"
                  footer={
                    <Show when={!rejectSuccess()} fallback={
                      <div class="flex items-center justify-center w-full">
                        <span class="text-green-600 font-semibold">✓ Shop rejected successfully!</span>
                      </div>
                    }>
                      <div class="flex gap-3 justify-end">
                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => setShowRejectModal(false)}
                          disabled={rejectSubmission.pending}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="md"
                          onClick={handleRejectConfirm}
                          disabled={rejectSubmission.pending || rejectError() !== null}
                        >
                          {rejectSubmission.pending ? "Rejecting..." : "Confirm Rejection"}
                        </Button>
                      </div>
                    </Show>
                  }
                >
                  <div class="space-y-4">
                    {/* Error Alert */}
                    <Show when={rejectError()}>
                      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div class="flex items-start gap-3">
                          <ExclamationCircleIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p class="text-sm text-red-800">{rejectError()}</p>
                        </div>
                      </div>
                    </Show>
                    
                    <Show when={!rejectError()}>
                      <div>
                        <Input
                          label="Rejection Reason *"
                          placeholder="Explain why this shop is being rejected"
                          value={rejectReason()}
                          onInput={(e) => setRejectReason(e.currentTarget.value)}
                          error={errors().reason}
                          required
                        />
                        <p class="text-xs text-slate-500 mt-1">
                          This reason will be visible to the shop owner
                        </p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-slate-700 mb-2">
                          Admin Notes (Optional)
                        </label>
                        <textarea
                          class="w-full h-24 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 text-sm resize-none"
                          placeholder="Internal notes about this rejection..."
                          value={adminNotes()}
                          onInput={(e) => setAdminNotes(e.currentTarget.value)}
                        />
                        <p class="text-xs text-slate-500 mt-1">
                          Internal notes - not visible to shop owner
                        </p>
                      </div>
                      
                      <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p class="text-xs text-red-800">
                          <strong class="font-semibold">Warning:</strong> Rejecting this shop will prevent it from operating on the platform. The shop owner can resubmit with corrected documents.
                        </p>
                      </div>
                    </Show>
                  </div>
                </Modal>
              </>
            );
          }}
        </Show>
      </Suspense>
      </ErrorBoundary>
    </div>
  );
}
