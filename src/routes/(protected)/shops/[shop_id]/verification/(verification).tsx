import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { Suspense, Show, ErrorBoundary } from "solid-js";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { getShopVerification, approveShop, rejectShop } from "~/lib/api/endpoints/shops";

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

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this shop?")) return;
    try {
      await approveShop(params.shop_id!);
      alert("Shop approved successfully");
      // Reload data
      window.location.reload();
    } catch (error) {
      console.error("Failed to approve shop:", error);
      alert("Failed to approve shop");
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    const adminNotes = prompt("Admin notes (optional):") || undefined;
    try {
      await rejectShop(params.shop_id!, reason, adminNotes);
      alert("Shop rejected successfully");
      // Reload data
      window.location.reload();
    } catch (error) {
      console.error("Failed to reject shop:", error);
      alert("Failed to reject shop");
    }
  };

  return (
    <div class="space-y-6">
      <ErrorBoundary
        fallback={(error) => (
          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600 flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
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
            const config = statusConfig[data().status];
            
            return (
              <>
                {/* Status Banner */}
                <div class={`rounded-xl p-6 border ${
                  config.variant === "warning" ? "bg-amber-50 border-amber-200" :
                  config.variant === "success" ? "bg-green-50 border-green-200" :
                  "bg-red-50 border-red-200"
                }`}>
                  <div class="flex items-start justify-between">
                    <div class="flex items-start gap-4">
                      <div class={`p-3 rounded-xl ${
                        config.variant === "warning" ? "bg-amber-100" :
                        config.variant === "success" ? "bg-green-100" :
                        "bg-red-100"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={
                          config.variant === "warning" ? "text-amber-600" :
                          config.variant === "success" ? "text-green-600" :
                          "text-red-600"
                        }>
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                      </div>
                      <div>
                        <h3 class={`text-lg font-semibold ${
                          config.variant === "warning" ? "text-amber-900" :
                          config.variant === "success" ? "text-green-900" :
                          "text-red-900"
                        }`}>{config.title}</h3>
                        <p class={`text-sm ${
                          config.variant === "warning" ? "text-amber-700" :
                          config.variant === "success" ? "text-green-700" :
                          "text-red-700"
                        } mt-1`}>{config.description}</p>
                        <div class="flex items-center gap-2 mt-3">
                          <Badge variant={config.variant}>{data().status}</Badge>
                          <span class={`text-xs ${
                            config.variant === "warning" ? "text-amber-600" :
                            config.variant === "success" ? "text-green-600" :
                            "text-red-600"
                          }`}>
                            Submitted on {new Date(data().submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {data().rejectionReason && (
                          <div class="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg">
                            <p class="text-xs text-red-800 font-medium">Rejection Reason:</p>
                            <p class="text-sm text-red-700 mt-1">{data().rejectionReason}</p>
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
                      <Button variant="primary" size="md" onClick={handleApprove}>Approve Shop</Button>
                      <Button variant="outline" size="md" onClick={handleReject}>Reject</Button>
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
                        <a href={data().tradeLicenseDocument.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          View Document
                        </a>
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
                        <a href={data().tinDocument.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          View Document
                        </a>
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
                        <a href={data().utilityBillDocument.url} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-primary-green-600 hover:text-primary-green-700 font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                          </svg>
                          View Document
                        </a>
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
              </>
            );
          }}
        </Show>
      </Suspense>
      </ErrorBoundary>
    </div>
  );
}
