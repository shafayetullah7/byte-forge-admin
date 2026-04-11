import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import type { Shop } from "~/lib/api/endpoints/shops";

interface ShopListProps {
  shops: Shop[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function ShopList(props: ShopListProps) {
  if (!props.shops || props.shops.length === 0) {
    return (
      <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
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
    );
  }

  return (
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
        <div class="col-span-3">Shop Name</div>
        <div class="col-span-2">Location</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-2">Created</div>
        <div class="col-span-2">Actions</div>
        <div class="col-span-1"></div>
      </div>

      {/* Table Body */}
      <div class="divide-y divide-slate-100">
        {props.shops.map((shop) => (
          <div class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center">
            {/* Shop Name */}
            <div class="col-span-3">
              <div class="font-medium text-slate-900">{shop.nameEn}</div>
              <div class="text-sm text-slate-500">{shop.slug}</div>
            </div>

            {/* Location */}
            <div class="col-span-2">
              <div class="text-sm text-slate-700">{shop.city}</div>
              <div class="text-xs text-slate-500">{shop.division}</div>
            </div>

            {/* Status */}
            <div class="col-span-2">
              <ShopStatusBadge status={shop.status} />
            </div>

            {/* Created Date */}
            <div class="col-span-2">
              <div class="text-sm text-slate-700">
                {new Date(shop.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Actions */}
            <div class="col-span-2">
              <a href={`/shops/${shop.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </a>
            </div>

            {/* Arrow */}
            <div class="col-span-1 flex justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {props.pagination && props.pagination.totalPages > 1 && (
        <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div class="text-sm text-slate-600">
            Showing {(props.pagination.page - 1) * props.pagination.limit + 1} to{" "}
            {Math.min(props.pagination.page * props.pagination.limit, props.pagination.total)} of{" "}
            {props.pagination.total} shops
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" disabled={props.pagination.page === 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={props.pagination.page === props.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ShopStatusBadgeProps {
  status: string;
}

export function ShopStatusBadge(props: ShopStatusBadgeProps) {
  const statusConfig: Record<string, { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
    APPROVED: { variant: "success", label: "Approved" },
    PENDING_VERIFICATION: { variant: "warning", label: "Pending" },
    REJECTED: { variant: "danger", label: "Rejected" },
    SUSPENDED: { variant: "danger", label: "Suspended" },
    INACTIVE: { variant: "neutral", label: "Inactive" },
    DRAFT: { variant: "neutral", label: "Draft" },
    DELETED: { variant: "neutral", label: "Deleted" },
  };

  const config = statusConfig[props.status] || { variant: "neutral", label: props.status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
