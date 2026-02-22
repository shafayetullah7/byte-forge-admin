import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useSession, logoutAction } from "~/lib/auth";
import { useSubmission } from "@solidjs/router";

export function AdminUserMenu() {
    const session = useSession();
    const logoutSubmission = useSubmission(logoutAction);
    const [isOpen, setIsOpen] = createSignal(false);

    const isLoggingOut = () => logoutSubmission.pending;

    let menuRef: HTMLDivElement | undefined;

    const toggleMenu = () => setIsOpen(!isOpen());

    // Close menu when clicking outside
    onMount(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef && !menuRef.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));
    });

    // Provide robust fallbacks if session data is still loading or partially absent
    const userInitials = () => {
        const s = session();
        if (s && s.userName) {
            return s.userName.substring(0, 2).toUpperCase();
        }
        return "AD";
    };

    return (
        <div class="relative" ref={menuRef}>
            <button
                type="button"
                class="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
                onClick={toggleMenu}
            >
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                    {userInitials()}
                </div>
                <div class="flex flex-col text-left hidden sm:flex">
                    <span class="text-sm font-medium text-slate-900 border-none truncate max-w-[120px]">
                        {session()?.userName || "Admin User"}
                    </span>
                    <span class="text-xs text-slate-500">Super Admin</span>
                </div>
                <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <Show when={isOpen()}>
                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md border border-slate-200 py-1 z-50">
                    <div class="px-4 py-2 border-b border-slate-100 sm:hidden">
                        <p class="text-sm text-slate-900 font-medium truncate">{session()?.userName}</p>
                        <p class="text-xs text-slate-500">Super Admin</p>
                    </div>
                    <button
                        onClick={() => { setIsOpen(false); /* navigate to profile */ }}
                        class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Your Profile
                    </button>
                    <button
                        onClick={() => { setIsOpen(false); /* navigate to settings */ }}
                        class="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Settings
                    </button>
                    <div class="border-t border-slate-100 my-1"></div>
                    <form action={logoutAction} method="post" class="w-full">
                        <button
                            type="submit"
                            disabled={isLoggingOut()}
                            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {isLoggingOut() ? "Signing out..." : "Sign out"}
                        </button>
                    </form>
                </div>
            </Show>
        </div>
    );
}
