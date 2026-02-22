import { A, useLocation } from "@solidjs/router";
import {
    PottedPlantIcon,
    DashboardIcon,
    StorefrontIcon,
    InventoryIcon,
    ShoppingCartIcon,
    PaymentsIcon,
    UsersIcon,
    VerifiedUserIcon,
    ChartPieIcon,
    SettingsIcon
} from "~/components/icons";

export function AdminSidebar() {
    const location = useLocation();

    // Helper to determine active state using solidjs router path matching
    const isActive = (path: string) => {
        if (path === "/") {
            return location.pathname === "/";
        }
        return location.pathname.startsWith(path);
    };

    const linkBaseClass = "flex items-center px-4 py-3 transition-colors duration-200 rounded-lg mx-2 mb-1 group text-sm font-medium";

    // Using Global Sidebar theme overrides (forest bg, cream text hover)
    const getLinkClass = (path: string) => {
        return isActive(path)
            ? `${linkBaseClass} bg-white/10 text-cream-50 font-semibold outline outline-1 outline-white/10`
            : `${linkBaseClass} text-forest-300 hover:bg-white/5 hover:text-cream-100`;
    };

    const getIconClass = (path: string) => {
        return isActive(path)
            ? "w-5 h-5 mr-3 text-cream-50"
            : "w-5 h-5 mr-3 text-forest-400 group-hover:text-cream-100";
    };

    return (
        <aside class="w-[240px] bg-forest-700 flex flex-col h-full flex-shrink-0 text-forest-300 border-r border-forest-600">
            {/* Logo Area */}
            <div class="h-[60px] flex items-center px-6 border-b border-white/10">
                <PottedPlantIcon class="w-7 h-7 text-cream-50 mr-2" />
                <span class="text-cream-50 font-bold text-lg tracking-wide">ByteForge</span>
            </div>

            {/* Navigation Elements */}
            <nav class="flex-1 overflow-y-auto py-6">
                <div class="px-5 mb-3 text-xs font-semibold text-forest-400 uppercase tracking-widest">Main Menu</div>

                <A href="/" class={getLinkClass("/")}>
                    <DashboardIcon class={getIconClass("/")} />
                    Overview
                </A>

                <A href="/vendors" class={getLinkClass("/vendors")}>
                    <StorefrontIcon class={getIconClass("/vendors")} />
                    Vendors
                </A>

                <A href="/products" class={getLinkClass("/products")}>
                    <InventoryIcon class={getIconClass("/products")} />
                    Products
                </A>

                <A href="/orders" class={getLinkClass("/orders")}>
                    <ShoppingCartIcon class={getIconClass("/orders")} />
                    Orders
                </A>

                <A href="/transactions" class={getLinkClass("/transactions")}>
                    <PaymentsIcon class={getIconClass("/transactions")} />
                    Transactions
                </A>

                <div class="px-5 mt-8 mb-3 text-xs font-semibold text-forest-400 uppercase tracking-widest">Management</div>

                <A href="/customers" class={getLinkClass("/customers")}>
                    <UsersIcon class={getIconClass("/customers")} />
                    Customers
                </A>

                <A href="/approvals" class={getLinkClass("/approvals")}>
                    <VerifiedUserIcon class={getIconClass("/approvals")} />
                    Approvals
                    <span class="ml-auto bg-terracotta-500/20 outline outline-1 outline-terracotta-500 text-terracotta-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                </A>

                <A href="/reports" class={getLinkClass("/reports")}>
                    <ChartPieIcon class={getIconClass("/reports")} />
                    Reports
                </A>

                <div class="px-5 mt-8 mb-3 text-xs font-semibold text-forest-400 uppercase tracking-widest">System</div>

                <A href="/settings" class={getLinkClass("/settings")}>
                    <SettingsIcon class={getIconClass("/settings")} />
                    Settings
                </A>
            </nav>

            {/* Bottom Section (Optional: Context or system info) */}
            <div class="p-4 border-t border-white/10 text-xs text-forest-400 text-center">
                Admin Panel v1.0.0
            </div>
        </aside>
    );
}
