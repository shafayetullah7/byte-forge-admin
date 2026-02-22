import { BellIcon, QuestionMarkCircleIcon } from "~/components/icons";
import { AdminUserMenu } from "./AdminUserMenu";

export function AdminNavbar() {
    return (
        <header class="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
            <div class="flex items-center gap-4">
                {/* Search or page context could go here, for now it's empty to leave room for flex behavior similar to the UI ref */}
            </div>

            <div class="flex items-center gap-4">
                <button
                    type="button"
                    title="Notifications"
                    class="text-slate-500 hover:text-primary-green transition-colors relative"
                >
                    <BellIcon class="w-6 h-6" />
                    <span class="absolute top-0 right-1 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
                </button>

                <button
                    type="button"
                    title="Help"
                    class="text-slate-500 hover:text-primary-green transition-colors mr-2"
                >
                    <QuestionMarkCircleIcon class="w-6 h-6" />
                </button>

                <div class="h-6 w-px bg-slate-200 mx-1"></div>

                <AdminUserMenu />
            </div>
        </header>
    );
}
