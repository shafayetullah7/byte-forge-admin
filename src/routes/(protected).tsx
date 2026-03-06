import { useNavigate } from "@solidjs/router";
import { createEffect, Show, Suspense, type JSX } from "solid-js";
import { useSession } from "~/lib/auth";
import { AdminSidebar, AdminNavbar } from "~/components/layout";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";

function LoadingFallback() {
    return (
        <div class="flex items-center justify-center min-h-screen">
            <div class="flex flex-col items-center gap-3">
                <div class="w-8 h-8 border-3 border-primary-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-sm text-slate-500 font-medium">Loading...</span>
            </div>
        </div>
    );
}

export default function ProtectedLayout(props: { children: JSX.Element }) {
    const user = useSession();
    const navigate = useNavigate();

    createEffect(() => {
        const userData = user();
        if (userData === null) {
            navigate("/login", { replace: true });
        }
    });

    return (
        <Show when={user()} fallback={<LoadingFallback />}>
            <div class="flex h-screen bg-slate-50 overflow-hidden">
                <AdminSidebar />
                <div class="flex-1 flex flex-col h-full overflow-hidden">
                    <AdminNavbar />
                    <main class="flex-1 overflow-y-auto p-6">
                        <SafeErrorBoundary fallback={(err, reset) => <PageErrorFallback error={err} reset={reset} />}>
                            <Suspense>{props.children}</Suspense>
                        </SafeErrorBoundary>
                    </main>
                </div>
            </div>
        </Show>
    );
}

