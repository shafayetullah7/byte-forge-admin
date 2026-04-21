import { useParams, type RouteSectionProps } from "@solidjs/router";
import { ShopDetailHeader, ShopTabNav, TabId } from "./[shop_id]/components";


const tabs: { id: TabId; label: string; icon: string; path: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", path: "" },
  { id: "verification", label: "Verification", icon: "verified_user", path: "verification" },
  { id: "profile", label: "Profile", icon: "storefront", path: "profile" },
  { id: "contact", label: "Contact", icon: "contact_phone", path: "contact" },
  { id: "address", label: "Address", icon: "location_on", path: "address" },
  { id: "products", label: "Products", icon: "inventory_2", path: "products" },
  { id: "orders", label: "Orders", icon: "shopping_cart", path: "orders" },
  { id: "delivery", label: "Delivery", icon: "local_shipping", path: "delivery" },
  { id: "owner", label: "Owner", icon: "person", path: "owner" },
  { id: "financials", label: "Financials", icon: "payments", path: "financials" },
  { id: "history", label: "History", icon: "history", path: "history" },
  { id: "actions", label: "Actions", icon: "settings", path: "actions" },
];

export default function ShopDetailLayout(props: RouteSectionProps) {
  const params = useParams();

  const shop = {
    id: params.shop_id || "demo-shop",
    name: "Green Garden Nursery",
    slug: "green-garden-nursery",
    status: "ACTIVE" as const,
    verificationStatus: "APPROVED" as const,
    logo: "https://images.unsplash.com/photo-1416879595882-3373a4f5795d?w=100&h=100&fit=crop",
    createdAt: "2024-01-15",
    owner: {
      firstName: "Md.",
      lastName: "Rahman",
      userName: "md_rahman",
      avatar: null,
      email: "rahman@example.com",
    },
  };

  return (
    <div class="min-h-screen bg-slate-50">
      <ShopDetailHeader shop={shop} />
      <ShopTabNav tabs={tabs} shopId={params.shop_id || ""} />
      <div class="p-6 max-w-[1400px] mx-auto">
        {props.children}
      </div>
    </div>
  );
}