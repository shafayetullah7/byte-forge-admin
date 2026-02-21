import { useNavigate } from "@solidjs/router";
import { createEffect, Show, Suspense } from "solid-js";
import { useSession } from "~/lib/auth";

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
            <div class="flex min-h-screen bg-slate-50">
                {/* Sidebar will go here in the future or we can move it from components */}
                <main class="flex-1 overflow-auto">
                    <Suspense>{props.children}</Suspense>
                </main>
            </div>
        </Show>
    );
}
