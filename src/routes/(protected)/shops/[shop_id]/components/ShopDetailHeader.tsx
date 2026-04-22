import { A } from "@solidjs/router";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { createSignal, onMount, onCleanup } from "solid-js";

interface Shop {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "PENDING_VERIFICATION" | "APPROVED" | "ACTIVE" | "INACTIVE" | "REJECTED" | "SUSPENDED" | "DELETED";
  verificationStatus: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED" | null;
  logo: string | null;
  createdAt: string;
  owner: {
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string | null;
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

const verificationStatusConfig: Record<"PENDING" | "REVIEWING" | "APPROVED" | "REJECTED", { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
  APPROVED: { variant: "success", label: "Verified" },
  REVIEWING: { variant: "warning", label: "Under Review" },
  PENDING: { variant: "neutral", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
};

export function ShopDetailHeader(props: ShopDetailHeaderProps) {
  const [isScrolled, setIsScrolled] = createSignal(false);

  onMount(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });

  const isExpanded = () => !isScrolled();

  return (
    <div class="bg-white border-b border-slate-200 transition-all duration-200" classList={{ "py-4": isExpanded(), "py-2": !isExpanded() }}>
      <div class="px-6">
        {/* Breadcrumb - hidden when scrolled */}
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-2 transition-all duration-200" classList={{ "opacity-0 h-0 overflow-hidden mb-0": !isExpanded(), "opacity-100": isExpanded() }}>
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
          <div class="flex items-start gap-4" classList={{ "items-center": !isExpanded() }}>
            {/* Logo */}
            <div class="rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 transition-all duration-200" classList={{ "w-10 h-10": !isExpanded(), "w-16 h-16": isExpanded() }}>
              {props.shop.logo ? (
                <img src={props.shop.logo} alt={props.shop.name} class="w-full h-full object-cover" />
              ) : (
                <div class="w-full h-full bg-slate-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
              )}
            </div>

            <div>
              <h1 class="font-bold text-slate-900 transition-all duration-200" classList={{ "text-lg": !isExpanded(), "text-xl": isExpanded() }}>
                {props.shop.name}
              </h1>
              
              <p class="text-slate-500 transition-all duration-200" classList={{ "text-xs hidden": !isExpanded(), "text-sm": isExpanded() }}>
                {props.shop.slug}
              </p>
              
              <p class="text-slate-400 text-xs mt-1 transition-all duration-200" classList={{ "hidden": !isExpanded() }}>
                Created {new Date(props.shop.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              
              <div class="flex items-center gap-2 mt-2">
                <Badge variant={shopStatusConfig[props.shop.status].variant} size={isExpanded() ? "md" : "sm"}>
                  {shopStatusConfig[props.shop.status].label}
                </Badge>
                {props.shop.verificationStatus && (
                  <Badge 
                    variant={verificationStatusConfig[props.shop.verificationStatus].variant} 
                    size={isExpanded() ? "md" : "sm"}
                  >
                    {verificationStatusConfig[props.shop.verificationStatus].label}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button variant="outline" size={isExpanded() ? "md" : "sm"}>View on Frontend</Button>
            {props.shop.status === "PENDING_VERIFICATION" && (
              <Button variant="primary" size={isExpanded() ? "md" : "sm"}>Review Verification</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
