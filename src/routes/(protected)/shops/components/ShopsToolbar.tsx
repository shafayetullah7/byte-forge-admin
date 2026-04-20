import { Input } from "~/components/ui/Input";
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
    <div class="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div class="relative w-full sm:max-w-[400px]">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <Input
          label="Search"
          placeholder="Search shops by name, location..."
          class="pl-10 w-full"
          value={props.search}
          onInput={(e) => props.onSearchChange(e.currentTarget.value)}
        />
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
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
          onChange={(e) => props.onVerificationStatusChange((e.currentTarget.value as ShopVerificationStatus) || undefined)}
        >
          <option value="">All Verifications</option>
          <option value="PENDING">Pending Review</option>
          <option value="REVIEWING">Under Review</option>
          <option value="APPROVED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
    </div>
  );
}
