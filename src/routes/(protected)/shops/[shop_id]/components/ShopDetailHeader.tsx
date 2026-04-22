import { A } from "@solidjs/router";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { createEffect, createSignal, onCleanup } from "solid-js";

type VerificationStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";

interface Shop {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "PENDING_VERIFICATION" | "APPROVED" | "ACTIVE" | "INACTIVE" | "REJECTED" | "SUSPENDED" | "DELETED";
  verificationStatus: VerificationStatus | null;
  logo?: string | null;
  banner?: string | null;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
    userName: string;
    avatar?: string | null;
  } | null;
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

const verificationStatusConfig: Record<VerificationStatus, { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
  APPROVED: { variant: "success", label: "Verified" },
  REVIEWING: { variant: "warning", label: "Under Review" },
  PENDING: { variant: "neutral", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
};

export function ShopDetailHeader(props: ShopDetailHeaderProps) {
  const statusConfig = shopStatusConfig[props.shop.status];
  const verificationConfig = props.shop.verificationStatus ? verificationStatusConfig[props.shop.verificationStatus] : null;
  const [isScrolled, setIsScrolled] = createSignal(false);

  createEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });

  return (
    <div class={`bg-white border-b border-slate-200 transition-all duration-200 ${isScrolled() ? "py-2" : "py-4"}`}>
      <div class="px-6">
        <div class={`flex items-center gap-2 text-sm text-slate-500 mb-2 transition-opacity duration-200 ${isScrolled() ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"}`}>
          <A href="/shops" class="hover:text-slate-700 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Shops
          </A>
          <span>/</span>
          <span class="text-slate-900 font-medium">{props.shop.name}</span>
        </div>

        <div class={`flex items-start justify-between gap-6 transition-all duration-200 ${isScrolled() ? "items-center" : ""}`}>
          <div class={`flex items-start gap-4 transition-all duration-200 ${isScrolled() ? "items-center" : ""}`}>
            <div class={`${isScrolled() ? "w-10 h-10" : "w-16 h-16"} rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 transition-all duration-200`}>
              {props.shop.logo ? (
                <img
                  src={props.shop.logo}
                  alt={props.shop.name}
                  class="w-full h-full object-cover"
                />
              ) : (
                <div class="w-full h-full bg-slate-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width={isScrolled() ? "18" : "24"} height={isScrolled() ? "18" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
              )}
            </div>

            <div class={`${isScrolled() ? "py-1" : ""}`}>
              <h1 class={`${isScrolled() ? "text-lg" : "text-xl"} font-bold text-slate-900 transition-all duration-200`}>{props.shop.name}</h1>
              <p class={`${isScrolled() ? "text-xs hidden" : "text-sm"} text-slate-500 transition-all duration-200`}>{props.shop.slug}</p>
              <p class={`${isScrolled() ? "hidden" : "text-xs"} text-slate-400 mt-1 transition-all duration-200`}>
                Created {new Date(props.shop.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              
              <div class="flex items-center gap-2 mt-2">
                <Badge variant={statusConfig.variant} size={isScrolled() ? "sm" : "md"}>{statusConfig.label}</Badge>
                {verificationConfig && (
                  <Badge variant={verificationConfig.variant} size={isScrolled() ? "sm" : "md"}>{verificationConfig.label}</Badge>
                )}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button variant="outline" size={isScrolled() ? "sm" : "md"}>
              View on Frontend
            </Button>
            {props.shop.status === "PENDING_VERIFICATION" && (
              <Button variant="primary" size={isScrolled() ? "sm" : "md"}>
                Review Verification
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}