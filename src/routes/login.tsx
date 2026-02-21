import { useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { loginAction } from "~/lib/api/auth";

export default function LoginPage() {
    const submission = useSubmission(loginAction);
    const [email, setEmail] = createSignal("");
    const [password, setPassword] = createSignal("");

    // The API client throws a normalized error object (or string), the submission primitive captures it in `submission.error`

    return (
        <main class="min-h-screen bg-[var(--color-slate-50)] flex items-center justify-center p-4">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                    <h1 class="text-2xl font-bold text-[var(--color-slate-900)]">Admin Login</h1>
                    <p class="text-[var(--color-slate-500)] mt-2">Sign in to the ByteForge Admin Panel</p>
                </div>

                <Card class="p-6">
                    <form action={loginAction} method="post" class="space-y-6">
                        <Show when={submission.error}>
                            <div class="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {submission.error.message || "An error occurred during login."}
                            </div>
                        </Show>

                        <Input
                            type="email"
                            name="email"
                            label="Email Address"
                            placeholder="admin@byteforge.com"
                            value={email()}
                            onInput={(e) => setEmail(e.currentTarget.value)}
                            required
                        />

                        <Input
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="••••••••"
                            value={password()}
                            onInput={(e) => setPassword(e.currentTarget.value)}
                            required
                        />

                        <Button
                            type="submit"
                            class="w-full"
                            isLoading={submission.pending}
                        >
                            Sign In
                        </Button>
                    </form>
                </Card>
            </div>
        </main>
    );
}
