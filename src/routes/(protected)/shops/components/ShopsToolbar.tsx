import { FilterToolbar } from "~/components/layout/FilterToolbar";
import type { ShopStatus, ShopVerificationStatus } from "~/lib/api/endpoints/shops";

export interface ShopsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ShopStatus | undefined;
  onStatusChange: (value: ShopStatus | undefined) => void;
  verificationStatus: ShopVerificationStatus | undefined;
  onVerificationStatusChange: (value: ShopVerificationStatus | undefined) => void;
}

export function ShopsToolbar(props: ShopsToolbarProps) {
  return (
    <FilterToolbar
      searchValue={props.search}
      onSearchChange={props.onSearchChange}
      searchLabel="Search"
      searchPlaceholder="Search shops by name, location..."
    >
      <select
        class="h-11 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 w-full sm:w-auto"
        value={props.status || ""}
        onChange={(e) => props.onStatusChange((e.currentTarget.value as ShopStatus) || undefined)}
      >
        <option value="">All Statuses</option>
        <option value="PENDING_VERIFICATION">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="ACTIVE">Active</option>
        <option value="REJECTED">Rejected</option>
        <option value="SUSPENDED">Suspended</option>
      </select>
      <select
        class="h-11 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 w-full sm:w-auto"
        value={props.verificationStatus || ""}
        onChange={(e) =>
          props.onVerificationStatusChange((e.currentTarget.value as ShopVerificationStatus) || undefined)
        }
      >
        <option value="">All Verifications</option>
        <option value="PENDING">Pending Review</option>
        <option value="REVIEWING">Under Review</option>
        <option value="APPROVED">Verified</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </FilterToolbar>
  );
}
