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
    SettingsIcon,
    ClipboardDocumentListIcon,
    FolderIcon
} from "~/components/icons";

export function AdminSidebar() {
    const location = useLocation();

    const linkBaseClass = "flex items-center px-4 py-3 transition-colors duration-200 rounded-lg mx-2 mb-1 group text-sm font-medium";

    // SolidStart Router activeClass properties
    const linkActiveClass = "bg-primary-green-800 text-white font-semibold outline outline-1 outline-primary-green-700/50";
    const linkInactiveClass = "text-primary-green-200 hover:bg-primary-green-900 hover:text-white";

    const iconBaseClass = "w-5 h-5 mr-3";
    const iconActiveClass = "text-white";
    const iconInactiveClass = "text-primary-green-400 group-hover:text-primary-green-200";

    return (
        <aside class="w-[240px] bg-primary-green-950 flex flex-col h-full flex-shrink-0 text-primary-green-50 border-r border-primary-green-900">
            {/* Logo Area */}
            <div class="h-[60px] flex items-center px-6 border-b border-primary-green-900">
                <PottedPlantIcon class="w-7 h-7 text-primary-green-400 mr-2" />
                <span class="text-white font-bold text-lg tracking-wide">ByteForge</span>
            </div>

            {/* Navigation Elements */}
            <nav class="flex-1 overflow-y-auto py-6">
                <div class="px-5 mb-3 text-xs font-semibold text-primary-green-500 uppercase tracking-widest">Main Menu</div>

                <A
                    href="/"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                    end={true} // Strict match for root
                >
                    <DashboardIcon class={`${iconBaseClass} ${location.pathname === "/" ? iconActiveClass : iconInactiveClass}`} />
                    Overview
                </A>

                <A
                    href="/shops"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <StorefrontIcon class={`${iconBaseClass} ${location.pathname.startsWith("/shops") ? iconActiveClass : iconInactiveClass}`} />
                    Shops
                </A>

                <A
                    href="/vendors"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <StorefrontIcon class={`${iconBaseClass} ${location.pathname.startsWith("/vendors") ? iconActiveClass : iconInactiveClass}`} />
                    Vendors
                </A>

                <A
                    href="/products"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <InventoryIcon class={`${iconBaseClass} ${location.pathname.startsWith("/products") ? iconActiveClass : iconInactiveClass}`} />
                    Products
                </A>

                <A
                    href="/tags"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <ClipboardDocumentListIcon class={`${iconBaseClass} ${location.pathname.startsWith("/tags") ? iconActiveClass : iconInactiveClass}`} />
                    Tag Library
                </A>

                <A
                    href="/categories"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <FolderIcon class={`${iconBaseClass} ${location.pathname.startsWith("/categories") ? iconActiveClass : iconInactiveClass}`} />
                    Categories
                </A>

                <A
                    href="/orders"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <ShoppingCartIcon class={`${iconBaseClass} ${location.pathname.startsWith("/orders") ? iconActiveClass : iconInactiveClass}`} />
                    Orders
                </A>

                <A
                    href="/transactions"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <PaymentsIcon class={`${iconBaseClass} ${location.pathname.startsWith("/transactions") ? iconActiveClass : iconInactiveClass}`} />
                    Transactions
                </A>

                <div class="px-5 mt-8 mb-3 text-xs font-semibold text-primary-green-500 uppercase tracking-widest">Management</div>

                <A
                    href="/customers"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <UsersIcon class={`${iconBaseClass} ${location.pathname.startsWith("/customers") ? iconActiveClass : iconInactiveClass}`} />
                    Customers
                </A>

                <A
                    href="/approvals"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <VerifiedUserIcon class={`${iconBaseClass} ${location.pathname.startsWith("/approvals") ? iconActiveClass : iconInactiveClass}`} />
                    Approvals
                    {/* TODO: Fetch pending count from API */}
                    {/* <span class="ml-auto bg-amber-500/20 outline outline-1 outline-amber-500 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{count}</span> */}
                </A>

                <A
                    href="/reports"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <ChartPieIcon class={`${iconBaseClass} ${location.pathname.startsWith("/reports") ? iconActiveClass : iconInactiveClass}`} />
                    Reports
                </A>

                <div class="px-5 mt-8 mb-3 text-xs font-semibold text-primary-green-500 uppercase tracking-widest">System</div>

                <A
                    href="/settings/languages"
                    class={linkBaseClass}
                    activeClass={linkActiveClass}
                    inactiveClass={linkInactiveClass}
                >
                    <SettingsIcon class={`${iconBaseClass} ${location.pathname.startsWith("/settings") ? iconActiveClass : iconInactiveClass}`} />
                    Settings
                </A>
            </nav>

            {/* Bottom Section (Optional: Context or system info) */}
            <div class="p-4 border-t border-primary-green-900 text-xs text-primary-green-500 text-center">
                Admin Panel
            </div>
        </aside>
    );
}
