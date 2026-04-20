import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/Badge";
import type { Shop, ShopStatus, ShopVerificationStatus } from "~/lib/api/endpoints/shops";

export interface ShopsTableProps {
  shops: Shop[];
}

const shopStatusConfig: Record<ShopStatus, { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
  APPROVED: { variant: "success", label: "Approved" },
  ACTIVE: { variant: "success", label: "Active" },
  PENDING_VERIFICATION: { variant: "warning", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
  SUSPENDED: { variant: "danger", label: "Suspended" },
  INACTIVE: { variant: "neutral", label: "Inactive" },
  DRAFT: { variant: "neutral", label: "Draft" },
  DELETED: { variant: "neutral", label: "Deleted" },
};

const verificationStatusConfig: Record<ShopVerificationStatus, { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
  APPROVED: { variant: "success", label: "Verified" },
  REVIEWING: { variant: "warning", label: "Reviewing" },
  PENDING: { variant: "neutral", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
};

function ShopStatusBadge(props: { status: ShopStatus }) {
  const config = shopStatusConfig[props.status] || { variant: "neutral" as const, label: props.status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function VerificationBadge(props: { status: ShopVerificationStatus }) {
  const config = verificationStatusConfig[props.status] || { variant: "neutral" as const, label: props.status };
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
}

export function ShopsTable(props: ShopsTableProps) {
  return (
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
        <div class="col-span-3">Shop Name</div>
        <div class="col-span-2">Owner</div>
        <div class="col-span-1">Location</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-2">Verification</div>
        <div class="col-span-1">Created</div>
        <div class="col-span-1"></div>
      </div>

      {/* Table Body */}
      <div class="divide-y divide-slate-100">
        <Show when={props.shops.length > 0} fallback={
          <div class="p-12 text-center">
            <div class="text-slate-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900">No shops found</h3>
            <p class="text-sm text-slate-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        }>
          <For each={props.shops}>
            {(shop: Shop) => (
              <div class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center">
                {/* Shop Name */}
                <div class="col-span-3">
                  <div class="flex items-center gap-3">
                    {shop.logoUrl ? (
                      <img
                        src={shop.logoUrl}
                        alt={shop.nameEn || shop.slug}
                        class="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                      </div>
                    )}
                    <div>
                      <div class="font-medium text-slate-900">{shop.nameEn || shop.slug}</div>
                      <div class="text-sm text-slate-500">{shop.slug}</div>
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div class="col-span-2">
                  <Show when={shop.owner} fallback={<span class="text-sm text-slate-400">—</span>}>
                    <div class="flex items-center gap-2">
                      {shop.owner!.avatar ? (
                        <img
                          src={shop.owner!.avatar}
                          alt={`${shop.owner!.firstName} ${shop.owner!.lastName}`}
                          class="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600">
                          {shop.owner!.firstName[0]}{shop.owner!.lastName[0]}
                        </div>
                      )}
                      <div class="text-sm text-slate-700 truncate">
                        {shop.owner!.firstName} {shop.owner!.lastName}
                      </div>
                    </div>
                  </Show>
                </div>

                {/* Location */}
                <div class="col-span-1">
                  <div class="text-sm text-slate-700 truncate">{shop.city || "—"}</div>
                </div>

                {/* Shop Status */}
                <div class="col-span-2 flex items-center">
                  <ShopStatusBadge status={shop.status} />
                </div>

                {/* Verification Status */}
                <div class="col-span-2">
                  <Show when={shop.verification} fallback={<span class="text-sm text-slate-400">—</span>}>
                    <div class="flex flex-col gap-1 items-start">
                      <VerificationBadge status={shop.verification!.status} />
                      <Show when={shop.verification!.rejectionReason}>
                        <div class="text-xs text-red-600 truncate max-w-[150px]" title={shop.verification!.rejectionReason!}>
                          {shop.verification!.rejectionReason}
                        </div>
                      </Show>
                    </div>
                  </Show>
                </div>

                {/* Created Date */}
                <div class="col-span-1">
                  <div class="text-sm text-slate-700">
                    {new Date(shop.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Arrow */}
                <div class="col-span-1 flex justify-end">
                  <A href={`/shops/${shop.id}`} class="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </A>
                </div>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
