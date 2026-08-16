import { useNavigate, useSearchParams } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import { revalidate, useAction, useSubmission } from "@solidjs/router";
import { completeOidcCallback } from "~/lib/auth/oidc-actions";

export default function AdminOidcCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const complete = useAction(completeOidcCallback);
  const submission = useSubmission(completeOidcCallback);
  const [started, setStarted] = createSignal(false);

  createEffect(() => {
    if (started() || submission.pending) return;

    const code = typeof searchParams.code === "string" ? searchParams.code : undefined;
    const state = typeof searchParams.state === "string" ? searchParams.state : undefined;
    const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

    if (code || error) {
      setStarted(true);
      complete({ code, state, error });
    }
  });

  createEffect(() => {
    const result = submission.result;
    if (!result) return;

    if (result.success) {
      void revalidate("admin-session").then(() => {
        navigate(result.returnTo || "/", { replace: true });
      });
      return;
    }

    navigate("/login?oidc_error=1", { replace: true });
  });

  return (
    <main class="min-h-[50vh] flex items-center justify-center p-8">
      <Show
        when={submission.result && !submission.result.success}
        fallback={<p class="text-sm text-slate-600">Completing admin sign-in…</p>}
      >
        <p class="text-sm text-red-600">Sign-in failed. Redirecting to login…</p>
      </Show>
    </main>
  );
}
