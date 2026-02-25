import { useNavigate } from "@solidjs/router";
import { createEffect, Show, Suspense } from "solid-js";
import { useSession } from "~/lib/auth";
import { AdminSidebar, AdminNavbar } from "~/components/layout";
import { SafeErrorBoundary, PageErrorFallback } from "~/components/errors";

export default function ProtectedLayout(props: { children: any }) {
    const user = useSession();
    const navigate = useNavigate();

    createEffect(() => {
        const userData = user();
        if (userData === null) {
            navigate("/login", { replace: true });
        }
    });

    return (
        <Show when={user()} fallback={<div class="flex items-center justify-center min-h-screen">Loading...</div>}>
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

