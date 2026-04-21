import { A } from "@solidjs/router";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";

interface Shop {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "PENDING_VERIFICATION" | "APPROVED" | "ACTIVE" | "INACTIVE" | "REJECTED" | "SUSPENDED" | "DELETED";
  verificationStatus: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  logo?: string | null;
  banner?: string | null;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
    userName: string;
    avatar?: string | null;
    email: string;
    phone?: string;
  };
}

export interface ShopDetailHeaderProps {
  shop: Shop;
}

const shopStatusConfig: Record<Shop["status"], { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
  APPROVED: { variant: "success", label: "Approved" },
  ACTIVE: { variant: "success", label: "Active" },
  PENDING_VERIFICATION: { variant: "warning", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
  SUSPENDED: { variant: "danger", label: "Suspended" },
  INACTIVE: { variant: "neutral", label: "Inactive" },
  DRAFT: { variant: "neutral", label: "Draft" },
  DELETED: { variant: "neutral", label: "Deleted" },
};

const verificationStatusConfig: Record<Shop["verificationStatus"], { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
  APPROVED: { variant: "success", label: "Verified" },
  REVIEWING: { variant: "warning", label: "Under Review" },
  PENDING: { variant: "neutral", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
};

export function ShopDetailHeader(props: ShopDetailHeaderProps) {
  const statusConfig = shopStatusConfig[props.shop.status];
  const verificationConfig = verificationStatusConfig[props.shop.verificationStatus];

  return (
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="px-6 py-4">
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <A href="/shops" class="hover:text-slate-700 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Shops
          </A>
          <span>/</span>
          <span class="text-slate-900 font-medium">{props.shop.name}</span>
        </div>

        <div class="flex items-start justify-between gap-6">
          <div class="flex items-start gap-4">
            {props.shop.logo ? (
              <img
                src={props.shop.logo}
                alt={props.shop.name}
                class="w-16 h-16 rounded-xl object-cover border border-slate-200"
              />
            ) : (
              <div class="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
            )}

            <div>
              <h1 class="text-xl font-bold text-slate-900">{props.shop.name}</h1>
              <p class="text-sm text-slate-500">{props.shop.slug}</p>
              <p class="text-xs text-slate-400 mt-1">
                Created {new Date(props.shop.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              
              <div class="flex items-center gap-2 mt-3">
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                <Badge variant={verificationConfig.variant} size="sm">{verificationConfig.label}</Badge>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button variant="outline" size="md">
              View on Frontend
            </Button>
            {props.shop.status === "PENDING_VERIFICATION" && (
              <Button variant="primary" size="md">
                Review Verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}